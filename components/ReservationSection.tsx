'use client'

import { useState } from 'react'
import Link from 'next/link'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Reservation, ReservationType } from '@/types'

const TYPE_ICON: Record<ReservationType, string> = {
  restaurant: '🍽️',
  ticket:     '🎟️',
  hotel:      '🏨',
  transport:  '🚃',
}

interface Props {
  dayNumber: number
  items: Reservation[]
}

export default function ReservationSection({ dayNumber, items }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleToggleDone = async (id: string, done: boolean) => {
    await updateDoc(doc(db, 'reservations', id), { done: !done })
  }

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'reservations', id))
    setConfirmingId(null)
  }

  const handleCopy = async (id: string, code: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span>📋</span>
          <p className="text-sm font-semibold text-gray-700">訂位 / 票券</p>
          <span className="text-xs bg-blue-100 text-blue-600 font-medium px-2 py-0.5 rounded-full">
            {items.length} 筆
          </span>
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

      {!collapsed && (
        <div className="divide-y divide-gray-50">
          {items.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">還沒有訂位或票券</p>
          )}
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3">
              <span className="text-xl shrink-0">{TYPE_ICON[item.type]}</span>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium leading-snug ${item.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {item.name}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  {item.time && (
                    <span className="text-xs text-gray-400">{item.time}</span>
                  )}
                  {item.confirmCode && (
                    <button
                      onClick={() => handleCopy(item.id, item.confirmCode!)}
                      className="text-[10px] font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded transition-colors hover:bg-gray-200"
                    >
                      {copiedId === item.id ? '已複製 ✓' : item.confirmCode}
                    </button>
                  )}
                </div>
              </div>

              {/* Done toggle */}
              <button
                onClick={() => handleToggleDone(item.id, item.done)}
                className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                  item.done ? 'bg-green-500 border-green-500' : 'border-gray-300'
                }`}
              >
                {item.done && (
                  <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3}>
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              {/* Delete */}
              <div className="shrink-0">
                {confirmingId === item.id ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs px-2 py-1 bg-red-500 text-white rounded-lg font-medium"
                    >
                      確定
                    </button>
                    <button
                      onClick={() => setConfirmingId(null)}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmingId(item.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add link */}
          <Link
            href={`/reservations/add?day=${dayNumber}`}
            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            新增訂位 / 票券
          </Link>
        </div>
      )}
    </div>
  )
}
