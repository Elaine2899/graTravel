'use client'

import { useEffect, useRef, useState } from 'react'
import { ITINERARY } from '@/data/itinerary'
import ActivityItem from '@/components/ActivityItem'
import GroupTabs from '@/components/GroupTabs'

const TRIP_START = new Date('2026-05-12T00:00:00+08:00')
const TRIP_END = new Date('2026-05-19T23:59:59+08:00')

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

export default function ItineraryPage() {
  const [activeDay, setActiveDay] = useState(getTodayDayNumber)
  const tabsRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const day = ITINERARY.find((d) => d.dayNumber === activeDay)!
  const hasGroups = day.activities.some((a) => a.group && a.group !== 'all')

  // 切換 day 時，將對應 tab 捲入可視範圍
  useEffect(() => {
    const tab = tabRefs.current[activeDay - 1]
    if (tab && tabsRef.current) {
      tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [activeDay])

  return (
    <div>
      {/* Sticky header */}
      <div className="sticky top-0 bg-[#f8f7f4] z-10">
        <div className="px-5 pt-10 pb-2">
          <h1 className="text-2xl font-bold text-gray-900">日本行程</h1>
          <p className="text-xs text-gray-400 mt-0.5">2026 / 5 / 12 – 5 / 19 ・ YY・Wei・Rae</p>
        </div>

        {/* Day tabs — horizontal scroll */}
        <div
          ref={tabsRef}
          className="overflow-x-auto scrollbar-none flex gap-2 px-4 pb-3"
        >
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
                <span className={`text-[10px] ${active ? 'text-rose-100' : 'text-gray-400'}`}>
                  {d.weekday}
                </span>
                <span className="text-lg font-bold leading-tight">{d.date.split('/')[1]}</span>
                <span className={`text-[10px] ${active ? 'text-rose-100' : 'text-gray-400'}`}>
                  {d.date.split('/')[0]}月
                </span>
              </button>
            )
          })}
        </div>

        {/* Day theme bar */}
        <div className="px-4 pb-3 flex items-center gap-2 border-b border-gray-100">
          <span className="text-lg">{THEME_EMOJI[day.theme] ?? '📅'}</span>
          <div>
            <span className="text-sm font-semibold text-gray-800">{day.theme}</span>
            <span className="text-xs text-gray-400 ml-2">Day {day.dayNumber}</span>
          </div>
        </div>
      </div>

      {/* Activities */}
      <div className="px-4 pt-3 space-y-2">
        {hasGroups ? (
          <GroupTabs activities={day.activities} />
        ) : (
          day.activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))
        )}
      </div>
    </div>
  )
}
