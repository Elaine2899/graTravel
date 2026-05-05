'use client'

import { useState } from 'react'
import { Activity, Group } from '@/types'
import ActivityItem from './ActivityItem'

const TABS: { key: Group; label: string }[] = [
  { key: 'all', label: '全員' },
  { key: 'YY+Rae', label: '宇治·稻荷組\nYY + Rae' },
  { key: 'Wei', label: '東京巨蛋組\nWei' },
]

export default function GroupTabs({ activities }: { activities: Activity[] }) {
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
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  )
}
