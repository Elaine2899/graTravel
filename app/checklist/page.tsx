'use client'

import { useEffect, useState } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/AuthContext'
import { MEMBERS, getMemberFromEmail } from '@/data/members'
import { CHECKLIST_ITEMS, CHECKLIST_CATEGORIES } from '@/data/checklist'
import { Member } from '@/types'
import AuthGuard from '@/components/AuthGuard'

const MEMBER_CHECKED: Record<Member, string> = {
  YY:  'bg-rose-500 border-rose-500',
  Wei: 'bg-blue-500 border-blue-500',
  Rae: 'bg-purple-500 border-purple-500',
}
const MEMBER_UNCHECKED: Record<Member, string> = {
  YY:  'border-rose-300',
  Wei: 'border-blue-300',
  Rae: 'border-purple-300',
}
const MEMBER_NAME_COLOR: Record<Member, string> = {
  YY:  'text-rose-600',
  Wei: 'text-blue-600',
  Rae: 'text-purple-600',
}
const MEMBER_PROGRESS_BG: Record<Member, string> = {
  YY:  'bg-rose-100',
  Wei: 'bg-blue-100',
  Rae: 'bg-purple-100',
}
const MEMBER_PROGRESS_FILL: Record<Member, string> = {
  YY:  'bg-rose-500',
  Wei: 'bg-blue-500',
  Rae: 'bg-purple-500',
}

function ChecklistContent() {
  const { user } = useAuth()
  const currentMember = getMemberFromEmail(user?.email)
  const [checkedByMember, setCheckedByMember] = useState<Record<Member, string[]>>({
    YY: [], Wei: [], Rae: [],
  })

  const total = CHECKLIST_ITEMS.length

  useEffect(() => {
    const unsubs = MEMBERS.map((m) =>
      onSnapshot(doc(db, 'checklist', m), (snap) => {
        setCheckedByMember((prev) => ({
          ...prev,
          [m]: snap.exists() ? (snap.data().checkedIds as string[] ?? []) : [],
        }))
      })
    )
    return () => unsubs.forEach((u) => u())
  }, [])

  const toggle = async (itemId: string) => {
    if (!currentMember) return
    const current = checkedByMember[currentMember]
    const newIds = current.includes(itemId)
      ? current.filter((id) => id !== itemId)
      : [...current, itemId]
    await setDoc(doc(db, 'checklist', currentMember), { checkedIds: newIds }, { merge: true })
  }

  const itemsByCategory = CHECKLIST_CATEGORIES.reduce<Record<string, typeof CHECKLIST_ITEMS>>(
    (acc, cat) => {
      acc[cat] = CHECKLIST_ITEMS.filter((i) => i.category === cat)
      return acc
    },
    {}
  )

  return (
    <div>
      <header className="px-5 pt-10 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">行前準備清單</h1>
        <p className="text-xs text-gray-400 mt-1">出發前確認每人都備齊了！</p>
      </header>

      {/* 三人完成率橫幅 */}
      <div className="mx-4 mb-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex gap-3">
          {MEMBERS.map((m) => {
            const count = checkedByMember[m].filter((id) =>
              CHECKLIST_ITEMS.some((i) => i.id === id)
            ).length
            const pct = Math.round((count / total) * 100)
            return (
              <div key={m} className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-semibold ${MEMBER_NAME_COLOR[m]}`}>{m}</span>
                  <span className="text-[10px] text-gray-500">{count}/{total}</span>
                </div>
                <div className={`h-1.5 rounded-full ${MEMBER_PROGRESS_BG[m]}`}>
                  <div
                    className={`h-1.5 rounded-full transition-all ${MEMBER_PROGRESS_FILL[m]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {count === total && (
                  <p className="text-[10px] text-center mt-0.5">✓ 完成</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 分類清單 */}
      <div className="px-4 space-y-4 pb-28">
        {CHECKLIST_CATEGORIES.map((cat) => (
          <div key={cat}>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">{cat}</p>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
              {itemsByCategory[cat].map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                  <p className="flex-1 text-sm text-gray-800">{item.label}</p>
                  <div className="flex gap-2 shrink-0">
                    {MEMBERS.map((m) => {
                      const checked = checkedByMember[m].includes(item.id)
                      const isMe = m === currentMember
                      return (
                        <button
                          key={m}
                          onClick={() => isMe && toggle(item.id)}
                          disabled={!isMe}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            checked
                              ? MEMBER_CHECKED[m]
                              : `bg-white ${MEMBER_UNCHECKED[m]}`
                          } ${!isMe ? 'cursor-default' : 'active:scale-90'}`}
                        >
                          {checked && (
                            <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3}>
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ChecklistPage() {
  return (
    <AuthGuard>
      <ChecklistContent />
    </AuthGuard>
  )
}
