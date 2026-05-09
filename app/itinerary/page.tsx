'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/AuthContext'
import { ITINERARY } from '@/data/itinerary'
import { getMemberFromEmail } from '@/data/members'
import { Activity, ActivityType, Expense, Group, Member, WishlistItem } from '@/types'
import ActivityItem from '@/components/ActivityItem'
import GroupTabs from '@/components/GroupTabs'
import JournalSection from '@/components/JournalSection'
import WishlistDaySection from '@/components/WishlistDaySection'

const TRIP_START = new Date('2026-05-12T00:00:00+08:00')
const TRIP_END   = new Date('2026-05-19T23:59:59+08:00')

function getTodayDayNumber(): number {
  const now = new Date()
  if (now < TRIP_START) return 1
  if (now > TRIP_END) return 8
  const diff = Math.floor((now.getTime() - TRIP_START.getTime()) / 86400000)
  return Math.min(Math.max(diff + 1, 1), 8)
}

const THEME_EMOJI: Record<string, string> = {
  '落地 day': '✈️',
  '和服 day': '👘',
  '分散 day': '🗺️',
  '忙碌 day': '🏃',
  '小鹿 day': '🦌',
  '都市 day': '🏙️',
  '環球 day': '🎢',
  '返程 day': '🏠',
}

interface DynamicActivity extends Activity {
  dayNumber: number
}

function timeToMins(t?: string | null): number {
  if (!t) return Infinity
  const [h, m] = t.split(':').map(Number)
  return h * 60 + (m || 0)
}

export default function ItineraryPage() {
  const { user } = useAuth()
  const currentMember = getMemberFromEmail(user?.email)

  const [activeDay, setActiveDay] = useState(getTodayDayNumber)
  const [dynamicActivities, setDynamicActivities] = useState<DynamicActivity[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [journalEntries, setJournalEntries] = useState<Partial<Record<Member, string>>>({})
  const [activityMoodsMap, setActivityMoodsMap] = useState<Record<string, Partial<Record<Member, string>>>>({})
  const [expenses, setExpenses] = useState<Expense[]>([])
  const tabsRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const q = query(collection(db, 'activities'), orderBy('createdAt', 'asc'))
    return onSnapshot(q, (snap) => {
      setDynamicActivities(snap.docs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          dayNumber: data.dayNumber as number,
          time: data.time ?? undefined,
          title: data.title as string,
          type: data.type as ActivityType,
          group: (data.group ?? 'all') as Group,
          details: data.note ? { transportInfo: data.note as string } : undefined,
        }
      }))
    })
  }, [])

  useEffect(() => {
    const q = query(collection(db, 'wishlist'), orderBy('createdAt', 'asc'))
    return onSnapshot(q, (snap) => {
      setWishlistItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as WishlistItem)))
    })
  }, [])

  useEffect(() => {
    return onSnapshot(doc(db, 'journal', String(activeDay)), (snap) => {
      setJournalEntries(snap.exists() ? (snap.data() as Partial<Record<Member, string>>) : {})
    })
  }, [activeDay])

  // Per-activity mood emojis
  useEffect(() => {
    return onSnapshot(collection(db, 'activityMoods'), (snap) => {
      const map: Record<string, Partial<Record<Member, string>>> = {}
      snap.docs.forEach((d) => { map[d.id] = d.data() as Partial<Record<Member, string>> })
      setActivityMoodsMap(map)
    })
  }, [])

  // Expenses for cost display per activity
  useEffect(() => {
    const q = query(collection(db, 'expenses'), orderBy('createdAt', 'asc'))
    return onSnapshot(q, (snap) => {
      setExpenses(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Expense)))
    })
  }, [])

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'activities', id))
  }

  const handleWishlistToggle = async (id: string, purchased: boolean) => {
    await updateDoc(doc(db, 'wishlist', id), { purchased: !purchased })
  }

  useEffect(() => {
    const tab = tabRefs.current[activeDay - 1]
    if (tab && tabsRef.current) {
      tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [activeDay])

  const day = ITINERARY.find((d) => d.dayNumber === activeDay)!

  const dynamicForDay = useMemo(
    () => dynamicActivities.filter((a) => a.dayNumber === activeDay),
    [dynamicActivities, activeDay]
  )

  const wishlistForDay = useMemo(
    () => wishlistItems.filter((i) => i.dayNumber === activeDay),
    [wishlistItems, activeDay]
  )

  const wishlistByActivityId = useMemo(() => {
    const map: Record<string, WishlistItem[]> = {}
    for (const item of wishlistItems) {
      if (item.locationId) {
        if (!map[item.locationId]) map[item.locationId] = []
        map[item.locationId].push(item)
      }
    }
    return map
  }, [wishlistItems])

  const totalSpentByActivityId = useMemo(() => {
    const map: Record<string, number> = {}
    for (const e of expenses) {
      if (e.activityId) {
        map[e.activityId] = (map[e.activityId] ?? 0) + e.amount
      }
    }
    return map
  }, [expenses])

  const dynamicIds = useMemo(
    () => new Set(dynamicForDay.map((a) => a.id)),
    [dynamicForDay]
  )

  const mergedActivities = useMemo(
    () =>
      [...day.activities, ...dynamicForDay].sort(
        (a, b) => timeToMins(a.time) - timeToMins(b.time)
      ),
    [day.activities, dynamicForDay]
  )

  const hasGroups = mergedActivities.some((a) => a.group && a.group !== 'all')

  return (
    <div>
      {/* Sticky header */}
      <div className="sticky top-0 bg-[#f8f7f4] z-10">
        <div className="px-5 pt-10 pb-2">
          <h1 className="text-2xl font-bold text-gray-900">日本行程</h1>
          <p className="text-xs text-gray-400 mt-0.5">2026 / 5 / 12 – 5 / 19 ・ YY・Wei・Rae</p>
        </div>

        {/* Day tabs */}
        <div ref={tabsRef} className="overflow-x-auto scrollbar-none flex gap-2 px-4 pb-3">
          {ITINERARY.map((d, i) => {
            const active = d.dayNumber === activeDay
            return (
              <button
                key={d.dayNumber}
                ref={(el) => { tabRefs.current[i] = el }}
                onClick={() => setActiveDay(d.dayNumber)}
                className={`shrink-0 flex flex-col items-center px-3 py-2 rounded-xl border text-center transition-colors min-w-[60px] ${
                  active
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                <span className={`text-[10px] ${active ? 'text-rose-100' : 'text-gray-400'}`}>{d.weekday}</span>
                <span className="text-lg font-bold leading-tight">{d.date.split('/')[1]}</span>
                <span className={`text-[10px] ${active ? 'text-rose-100' : 'text-gray-400'}`}>{d.date.split('/')[0]}月</span>
              </button>
            )
          })}
        </div>

        {/* Day theme bar */}
        <div className="px-4 py-2.5 flex items-center gap-2 border-b border-gray-100">
          <span className="text-lg">{THEME_EMOJI[day.theme] ?? '📅'}</span>
          <span className="text-sm font-semibold text-gray-800">{day.theme}</span>
          <span className="text-xs text-gray-400">Day {day.dayNumber}</span>
        </div>
      </div>

      {/* Activities */}
      <div className="px-4 pt-3 space-y-2">
        {hasGroups ? (
          <GroupTabs
            activities={mergedActivities}
            dynamicIds={dynamicIds}
            onDelete={handleDelete}
            wishlistByActivityId={wishlistByActivityId}
            dayNumber={activeDay}
            currentMember={currentMember}
            moodsByActivityId={activityMoodsMap}
            totalSpentByActivityId={totalSpentByActivityId}
          />
        ) : (
          mergedActivities.map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              onDelete={dynamicIds.has(activity.id) ? () => handleDelete(activity.id) : undefined}
              wishlistItems={wishlistByActivityId[activity.id] ?? []}
              dayNumber={activeDay}
              currentMember={currentMember}
              activityMoods={activityMoodsMap[activity.id]}
              totalSpent={totalSpentByActivityId[activity.id]}
            />
          ))
        )}
      </div>

      {/* 當日購物清單 + 日記 */}
      <div className="px-4 pt-3 pb-24 space-y-3">
        {wishlistForDay.length > 0 && (
          <WishlistDaySection items={wishlistForDay} onToggle={handleWishlistToggle} />
        )}
        <JournalSection
          dayNumber={activeDay}
          currentMember={currentMember}
          entries={journalEntries}
        />
      </div>

      {/* FAB 新增行程 */}
      <Link
        href={`/itinerary/add?day=${activeDay}`}
        className="fixed bottom-20 right-4 w-14 h-14 bg-rose-500 rounded-full flex items-center justify-center shadow-lg text-white active:scale-95 transition-transform"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </Link>
    </div>
  )
}
