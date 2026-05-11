'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/AuthContext'
import { WishlistItem, Member } from '@/types'
import { MEMBERS, getMemberFromEmail } from '@/data/members'

const MEMBER_CHIP: Record<Member, string> = {
  YY:  'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
  Wei: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  Rae: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
}
const MEMBER_ACTIVE: Record<Member, string> = {
  YY:  'border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  Wei: 'border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  Rae: 'border-purple-400 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
}

interface Props {
  activityId: string
  activityName: string   // clean display name
  dayNumber: number
  items: WishlistItem[]
  onClose: () => void
}

export default function WishlistActivityModal({ activityId, activityName, dayNumber, items, onClose }: Props) {
  const { user } = useAuth()
  const currentMember = getMemberFromEmail(user?.email)

  const [newItem, setNewItem] = useState('')
  const [newWantedBy, setNewWantedBy] = useState<Member[]>(currentMember ? [currentMember] : [])
  const [adding, setAdding] = useState(false)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const initialized = useRef(false)

  // Set default wantedBy after auth resolves
  useEffect(() => {
    if (!initialized.current && user) {
      const m = getMemberFromEmail(user.email)
      if (m) setNewWantedBy([m])
      initialized.current = true
    }
  }, [user])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleToggle = async (id: string, purchased: boolean) => {
    await updateDoc(doc(db, 'wishlist', id), { purchased: !purchased })
  }

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'wishlist', id))
    setConfirmingId(null)
  }

  const handleAdd = async () => {
    if (!newItem.trim() || newWantedBy.length === 0 || adding) return
    setAdding(true)
    await addDoc(collection(db, 'wishlist'), {
      item: newItem.trim(),
      locationId: activityId,
      dayNumber,
      wantedBy: newWantedBy,
      purchased: false,
      createdAt: serverTimestamp(),
    })
    setNewItem('')
    setAdding(false)
  }

  const toggleMember = (m: Member) => {
    setNewWantedBy((prev) =>
      prev.includes(m)
        ? prev.length > 1 ? prev.filter((x) => x !== m) : prev
        : [...prev, m]
    )
  }

  const pending = items.filter((i) => !i.purchased).length

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-t-3xl max-h-[80vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-gray-100 dark:border-gray-700 shrink-0">
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">🛍️ 購物清單</p>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-50 mt-0.5">{activityName}</h2>
            {items.length > 0 && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {items.length - pending}/{items.length} 件已購買
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {items.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">還沒有清單，在下方新增第一項！</p>
          )}
          <div className="space-y-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
                <button
                  onClick={() => handleToggle(item.id, item.purchased)}
                  className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                    item.purchased ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {item.purchased && (
                    <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3}>
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug ${item.purchased ? 'line-through text-gray-400 dark:text-gray-600' : 'text-gray-800 dark:text-gray-100'}`}>
                    {item.item}
                  </p>
                  {item.store && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.store}</p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.wantedBy.map((m) => (
                      <span key={m} className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${MEMBER_CHIP[m]}`}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

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
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg"
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmingId(item.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inline add form */}
        <div className="border-t border-gray-100 dark:border-gray-700 px-5 pt-3 pb-6 space-y-2.5 shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="新增物品..."
              className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2.5 text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-rose-400 transition-colors"
            />
            <button
              onClick={handleAdd}
              disabled={!newItem.trim() || newWantedBy.length === 0 || adding}
              className="px-4 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-semibold disabled:opacity-40 active:scale-95 transition-all"
            >
              新增
            </button>
          </div>
          <div className="flex gap-2">
            {MEMBERS.map((m) => (
              <button
                key={m}
                onClick={() => toggleMember(m)}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                  newWantedBy.includes(m) ? MEMBER_ACTIVE[m] : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
