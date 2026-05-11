'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import Link from 'next/link'
import { db } from '@/lib/firebase'
import { ActivityType, Group } from '@/types'
import { ITINERARY } from '@/data/itinerary'
import AuthGuard from '@/components/AuthGuard'

const ACTIVITY_TYPES: { type: ActivityType; label: string; emoji: string }[] = [
  { type: 'attraction', label: '景點', emoji: '🗺️' },
  { type: 'food',       label: '餐飲', emoji: '🍜' },
  { type: 'transport',  label: '交通', emoji: '🚃' },
  { type: 'hotel',      label: '住宿', emoji: '🏨' },
  { type: 'flight',     label: '航班', emoji: '✈️' },
]

const GROUPS: { group: Group; label: string }[] = [
  { group: 'all',     label: '全員' },
  { group: 'YY+Rae', label: 'YY + Rae' },
  { group: 'Wei',     label: 'Wei' },
]

function AddActivityForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultDay = Number(searchParams.get('day')) || 1

  const [selectedDay, setSelectedDay] = useState(defaultDay)
  const [title, setTitle] = useState('')
  const [type, setType] = useState<ActivityType>('attraction')
  const [time, setTime] = useState('')
  const [group, setGroup] = useState<Group>('all')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim()) return
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'activities'), {
        dayNumber: selectedDay,
        time: time.trim() || null,
        title: title.trim(),
        type,
        group: selectedDay === 3 ? group : 'all',
        note: note.trim() || null,
        createdAt: serverTimestamp(),
      })
      router.push('/itinerary')
    } catch {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <header className="px-5 pt-10 pb-4">
        <Link href="/itinerary" className="flex items-center gap-1 text-sm text-rose-500 mb-3">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          返回行程
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">新增行程</h1>
      </header>

      <div className="px-4 space-y-5 pb-10">
        {/* 選天 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">選擇日期</label>
          <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-none pb-1">
            {ITINERARY.map((d) => (
              <button
                key={d.dayNumber}
                onClick={() => setSelectedDay(d.dayNumber)}
                className={`shrink-0 flex flex-col items-center px-3 py-2 rounded-xl border text-center min-w-[56px] transition-colors ${
                  selectedDay === d.dayNumber
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                <span className={`text-[10px] ${selectedDay === d.dayNumber ? 'text-rose-100' : 'text-gray-400 dark:text-gray-500'}`}>
                  {d.weekday}
                </span>
                <span className="text-base font-bold leading-tight">{d.date.split('/')[1]}</span>
                <span className={`text-[10px] ${selectedDay === d.dayNumber ? 'text-rose-100' : 'text-gray-400 dark:text-gray-500'}`}>
                  Day {d.dayNumber}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 標題 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">行程名稱</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 錦市場午餐、嵐山散步..."
            className="w-full mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-rose-400 transition-colors"
          />
        </div>

        {/* 類型 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">類型</label>
          <div className="flex gap-2 mt-2">
            {ACTIVITY_TYPES.map(({ type: t, label, emoji }) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 flex flex-col items-center gap-0.5 px-2 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                  type === t
                    ? 'bg-rose-50 border-rose-400 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                <span className="text-base">{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 時間（選填） */}
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">時間（選填）</label>
          <input
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g. 10:00"
            inputMode="numeric"
            className="w-full mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-rose-400 transition-colors"
          />
        </div>

        {/* Day 3 分組 */}
        {selectedDay === 3 && (
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">分組</label>
            <div className="flex gap-2 mt-2">
              {GROUPS.map(({ group: g, label }) => (
                <button
                  key={g}
                  onClick={() => setGroup(g)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                    group === g
                      ? 'bg-gray-800 border-gray-800 text-white dark:bg-gray-200 dark:border-gray-200 dark:text-gray-900'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 備注（選填） */}
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">備注（選填）</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="交通資訊、注意事項..."
            rows={3}
            className="w-full mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-rose-400 transition-colors resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!title.trim() || submitting}
          className="w-full bg-rose-500 text-white rounded-xl py-4 font-semibold text-base disabled:opacity-40 active:scale-[0.98] transition-all"
        >
          {submitting ? '儲存中...' : '儲存'}
        </button>
      </div>
    </div>
  )
}

export default function AddActivityPage() {
  return (
    <AuthGuard>
      <Suspense>
        <AddActivityForm />
      </Suspense>
    </AuthGuard>
  )
}
