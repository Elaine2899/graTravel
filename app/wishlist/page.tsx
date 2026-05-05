'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { WishlistItem, Member } from '@/types'
import { MEMBERS } from '@/data/members'
import { ITINERARY } from '@/data/itinerary'
import WishlistCard from '@/components/WishlistCard'
import AuthGuard from '@/components/AuthGuard'

const FILTER_STYLE: Record<string, { active: string; inactive: string }> = {
  all: { active: 'bg-gray-800 border-gray-800 text-white',     inactive: 'bg-white border-gray-200 text-gray-500' },
  YY:  { active: 'bg-rose-500 border-rose-500 text-white',     inactive: 'bg-white border-gray-200 text-gray-500' },
  Wei: { active: 'bg-blue-500 border-blue-500 text-white',     inactive: 'bg-white border-gray-200 text-gray-500' },
  Rae: { active: 'bg-purple-500 border-purple-500 text-white', inactive: 'bg-white border-gray-200 text-gray-500' },
}

const DAY_LABEL: Record<number, string> = Object.fromEntries(
  ITINERARY.map((d) => [d.dayNumber, `Day ${d.dayNumber}・${d.date}（${d.weekday}）${d.theme}`])
)

function WishlistContent() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [snapError, setSnapError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | Member>('all')

  useEffect(() => {
    const q = query(collection(db, 'wishlist'), orderBy('createdAt', 'asc'))
    return onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as WishlistItem)))
        setLoading(false)
        setSnapError(null)
      },
      (err) => {
        console.error('wishlist snapshot error:', err)
        setSnapError(err.message)
        setLoading(false)
      }
    )
  }, [])

  const handleToggle = async (id: string, purchased: boolean) => {
    await updateDoc(doc(db, 'wishlist', id), { purchased: !purchased })
  }

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'wishlist', id))
  }

  const filtered = filter === 'all' ? items : items.filter((i) => i.wantedBy.includes(filter as Member))

  const purchased = filtered.filter((i) => i.purchased).length

  // Group by dayNumber; unassigned last
  const dayGroups: { key: number | 'none'; label: string; items: WishlistItem[] }[] = []
  const seenDays = new Set<number>()

  for (const d of ITINERARY) {
    const dayItems = filtered.filter((i) => i.dayNumber === d.dayNumber)
    if (dayItems.length > 0) {
      dayGroups.push({ key: d.dayNumber, label: DAY_LABEL[d.dayNumber], items: dayItems })
      seenDays.add(d.dayNumber)
    }
  }
  const unassigned = filtered.filter((i) => !i.dayNumber)
  if (unassigned.length > 0) {
    dayGroups.push({ key: 'none', label: '未指定日期', items: unassigned })
  }

  return (
    <div>
      <header className="px-5 pt-10 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">購物清單</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {purchased}/{filtered.length} 件已購買
            </p>
          </div>
        </div>

        {/* 人員篩選 */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-none pb-0.5">
          {(['all', ...MEMBERS] as ('all' | Member)[]).map((m) => {
            const style = FILTER_STYLE[m]
            const active = filter === m
            return (
              <button
                key={m}
                onClick={() => setFilter(m)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  active ? style.active : style.inactive
                }`}
              >
                {m === 'all' ? '全部' : m}
              </button>
            )
          })}
        </div>
      </header>

      <div className="px-4 space-y-5 pb-24">
        {loading && (
          <p className="text-center text-sm text-gray-400 py-8">載入中...</p>
        )}
        {snapError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
            <p className="font-medium">無法載入資料</p>
            <p className="mt-1 text-xs text-red-400">{snapError}</p>
          </div>
        )}
        {!loading && !snapError && filtered.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">還沒有任何購物願望</p>
        )}

        {dayGroups.map(({ key, label, items: groupItems }) => (
          <div key={String(key)}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">
              {label}
            </p>
            <div className="space-y-2">
              {groupItems.map((item) => (
                <WishlistCard
                  key={item.id}
                  item={item}
                  onToggle={() => handleToggle(item.id, item.purchased)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/wishlist/add"
        className="fixed bottom-20 right-4 w-14 h-14 bg-rose-500 rounded-full flex items-center justify-center shadow-lg text-white active:scale-95 transition-transform"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </Link>
    </div>
  )
}

export default function WishlistPage() {
  return (
    <AuthGuard>
      <WishlistContent />
    </AuthGuard>
  )
}
