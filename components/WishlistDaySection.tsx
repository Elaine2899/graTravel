'use client'

import { useState } from 'react'
import { WishlistItem, Member } from '@/types'

const MEMBER_CHIP: Record<Member, string> = {
  YY:  'bg-rose-100 text-rose-700',
  Wei: 'bg-blue-100 text-blue-700',
  Rae: 'bg-purple-100 text-purple-700',
}

interface Props {
  items: WishlistItem[]
  onToggle: (id: string, purchased: boolean) => void
}

export default function WishlistDaySection({ items, onToggle }: Props) {
  const [collapsed, setCollapsed] = useState(false)

  if (items.length === 0) return null

  const pending = items.filter((i) => !i.purchased).length

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span>🛍️</span>
          <p className="text-sm font-semibold text-gray-700">購物清單</p>
          {pending > 0 ? (
            <span className="text-xs bg-rose-100 text-rose-600 font-medium px-2 py-0.5 rounded-full">
              {pending} 件待購
            </span>
          ) : (
            <span className="text-xs bg-green-100 text-green-600 font-medium px-2 py-0.5 rounded-full">
              全部購齊 🎉
            </span>
          )}
        </div>
        <svg
          viewBox="0 0 24 24"
          className={`w-4 h-4 text-gray-400 transition-transform ${collapsed ? '-rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {!collapsed && <div className="divide-y divide-gray-50">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => onToggle(item.id, item.purchased)}
              className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                item.purchased ? 'bg-green-500 border-green-500' : 'border-gray-300'
              }`}
            >
              {item.purchased && (
                <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3}>
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm leading-snug ${item.purchased ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {item.item}
              </p>
              {(item.store || item.location) && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {[item.store, item.location].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-1 shrink-0">
              {item.wantedBy.map((m) => (
                <span key={m} className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${MEMBER_CHIP[m]}`}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>}
    </div>
  )
}
