'use client'

import { useEffect, useRef, useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Member } from '@/types'
import { MEMBERS } from '@/data/members'

const MEMBER_COLOR: Record<Member, { bg: string; border: string; name: string }> = {
  YY:  { bg: 'bg-rose-50 dark:bg-rose-950',     border: 'border-rose-100 dark:border-rose-800',     name: 'text-rose-600 dark:text-rose-400' },
  Wei: { bg: 'bg-blue-50 dark:bg-blue-950',     border: 'border-blue-100 dark:border-blue-800',     name: 'text-blue-600 dark:text-blue-400' },
  Rae: { bg: 'bg-purple-50 dark:bg-purple-950', border: 'border-purple-100 dark:border-purple-800', name: 'text-purple-600 dark:text-purple-400' },
}

interface Props {
  dayNumber: number
  currentMember: Member | null
  entries: Partial<Record<Member, string>>
}

export default function JournalSection({ dayNumber, currentMember, entries }: Props) {
  const hasContent = MEMBERS.some((m) => entries[m]?.trim())
  const [collapsed, setCollapsed] = useState(true)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-expand when entries arrive
  useEffect(() => {
    if (hasContent) setCollapsed(false)
  }, [hasContent])

  const startEdit = () => {
    setDraft(entries[currentMember!] ?? '')
    setEditing(true)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  const saveEntry = async () => {
    if (!currentMember) return
    const text = draft.trim()
    if (text !== (entries[currentMember] ?? '').trim()) {
      await setDoc(doc(db, 'journal', String(dayNumber)), { [currentMember]: text || null }, { merge: true })
    }
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      saveEntry()
    }
    if (e.key === 'Escape') {
      setEditing(false)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span>📝</span>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">今日日記</p>
          {hasContent && (
            <span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 font-medium px-2 py-0.5 rounded-full">
              {MEMBERS.filter((m) => entries[m]?.trim()).length} 人已記錄
            </span>
          )}
        </div>
        <svg
          viewBox="0 0 24 24"
          className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${collapsed ? '-rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {!collapsed && (
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {MEMBERS.map((m) => {
            const isMe = m === currentMember
            const text = entries[m]
            const colors = MEMBER_COLOR[m]

            return (
              <div key={m} className="px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className={`text-xs font-semibold ${colors.name}`}>{m}</span>
                  {isMe && !editing && (
                    <button
                      onClick={startEdit}
                      className="text-[10px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {text ? '編輯' : '+ 寫點什麼'}
                    </button>
                  )}
                </div>

                {isMe && editing ? (
                  <textarea
                    ref={textareaRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={saveEntry}
                    onKeyDown={handleKeyDown}
                    placeholder="今天的亮點 / 糗事..."
                    rows={2}
                    className={`w-full rounded-xl border px-3 py-2 text-sm text-gray-800 dark:text-gray-100 outline-none resize-none ${colors.bg} ${colors.border} focus:border-gray-300 dark:focus:border-gray-600`}
                  />
                ) : text ? (
                  <p
                    className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                    onClick={() => isMe && startEdit()}
                  >
                    {text}
                  </p>
                ) : (
                  <p className="text-sm text-gray-300 dark:text-gray-600 italic">
                    {isMe ? '點擊記錄今天的心情...' : '還沒寫'}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
