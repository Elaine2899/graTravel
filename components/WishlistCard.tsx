'use client'

import { useState } from 'react'
import Link from 'next/link'
import { WishlistItem, Member } from '@/types'
import { getLocationName } from '@/data/locations'

const MEMBER_CHIP: Record<Member, string> = {
  YY:  'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
  Wei: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  Rae: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
}

interface Props {
  item: WishlistItem
  onToggle: () => void
  onDelete: () => void
}

export default function WishlistCard({ item, onToggle, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false)
  const locationDisplay = getLocationName(item.locationId) ?? item.location ?? null

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700 transition-opacity ${item.purchased ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        {/* 打勾圓圈 */}
        <button
          onClick={onToggle}
          className={`mt-0.5 w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
            item.purchased ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          {item.purchased && (
            <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3}>
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* 內容 */}
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-sm leading-snug ${item.purchased ? 'line-through text-gray-400 dark:text-gray-600' : 'text-gray-800 dark:text-gray-100'}`}>
            {item.item}
          </p>
          {(locationDisplay || item.store) && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {[locationDisplay, item.store].filter(Boolean).join(' · ')}
            </p>
          )}
          {item.note && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 italic">{item.note}</p>
          )}
          <div className="flex flex-wrap gap-1 mt-1.5">
            {item.wantedBy.map((m) => (
              <span key={m} className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${MEMBER_CHIP[m]}`}>
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex items-center gap-1 shrink-0 mt-0.5">
          {confirming ? (
            <div className="flex gap-1">
              <button
                onClick={onDelete}
                className="text-xs px-2 py-1 bg-red-500 text-white rounded-lg font-medium"
              >
                確定
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg"
              >
                取消
              </button>
            </div>
          ) : (
            <>
              <Link
                href={`/wishlist/${item.id}/edit`}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 dark:text-gray-600 hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <button
                onClick={() => setConfirming(true)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
