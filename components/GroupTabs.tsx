'use client'

import { useState } from 'react'
import { Activity, Group, Member, WishlistItem } from '@/types'
import ActivityItem from './ActivityItem'

const TABS: { key: Group; label: string }[] = [
  { key: 'all', label: '全員' },
  { key: 'YY+Rae', label: '宇治·稻荷組\nYY + Rae' },
  { key: 'Wei', label: '東京巨蛋組\nWei' },
]

interface Props {
  activities: Activity[]
  dynamicIds?: Set<string>
  onDelete?: (id: string) => void
  wishlistByActivityId?: Record<string, WishlistItem[]>
  dayNumber?: number
  currentMember?: Member | null
  moodsByActivityId?: Record<string, Partial<Record<Member, string>>>
  totalSpentByActivityId?: Record<string, number>
}

export default function GroupTabs({ activities, dynamicIds, onDelete, wishlistByActivityId, dayNumber, currentMember, moodsByActivityId, totalSpentByActivityId }: Props) {
  const [active, setActive] = useState<Group>('all')

  const filtered = activities.filter(
    (a) => a.group === 'all' || a.group === active || active === 'all'
  )

  return (
    <div>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium whitespace-pre-line text-center transition-colors ${
              active === tab.key
                ? 'bg-rose-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            onDelete={dynamicIds?.has(activity.id) ? () => onDelete?.(activity.id) : undefined}
            editHref={dynamicIds?.has(activity.id) ? `/itinerary/edit?id=${activity.id}&day=${dayNumber}` : undefined}
            wishlistItems={wishlistByActivityId?.[activity.id] ?? []}
            dayNumber={dayNumber}
            currentMember={currentMember}
            activityMoods={moodsByActivityId?.[activity.id]}
            totalSpent={totalSpentByActivityId?.[activity.id]}
          />
        ))}
      </div>
    </div>
  )
}
