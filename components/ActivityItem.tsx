'use client'

import { useState } from 'react'
import { Activity } from '@/types'

const TYPE_ICON: Record<string, string> = {
  flight: '✈️',
  transport: '🚃',
  attraction: '🗺️',
  food: '🍜',
  hotel: '🏨',
}

const TYPE_COLOR: Record<string, string> = {
  flight: 'bg-blue-50 border-blue-200',
  transport: 'bg-gray-50 border-gray-200',
  attraction: 'bg-amber-50 border-amber-200',
  food: 'bg-orange-50 border-orange-200',
  hotel: 'bg-green-50 border-green-200',
}

export default function ActivityItem({ activity }: { activity: Activity }) {
  const [open, setOpen] = useState(false)
  const hasDetails = activity.details && Object.values(activity.details).some(Boolean)

  return (
    <div className={`rounded-xl border ${TYPE_COLOR[activity.type]} overflow-hidden`}>
      <button
        className="w-full flex items-start gap-3 px-4 py-3 text-left"
        onClick={() => hasDetails && setOpen((o) => !o)}
      >
        <span className="text-xl mt-0.5 shrink-0">{TYPE_ICON[activity.type]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-sm leading-snug text-gray-800">{activity.title}</p>
            {hasDetails && (
              <svg
                viewBox="0 0 24 24"
                className={`w-4 h-4 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          {activity.time && (
            <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
          )}
        </div>
      </button>

      {open && activity.details && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
          {activity.details.culturalNote && (
            <section>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-1.5">文史知識</h4>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{activity.details.culturalNote}</p>
            </section>
          )}
          {activity.details.transportInfo && (
            <section>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-1.5">交通資訊</h4>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{activity.details.transportInfo}</p>
            </section>
          )}
          {activity.details.ticketInfo && (
            <section>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-1.5">票券資訊</h4>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{activity.details.ticketInfo}</p>
            </section>
          )}
          {activity.details.recommendations && activity.details.recommendations.length > 0 && (
            <section>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-1.5">推薦 / 注意事項</h4>
              <ul className="space-y-1">
                {activity.details.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-amber-500 shrink-0">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
