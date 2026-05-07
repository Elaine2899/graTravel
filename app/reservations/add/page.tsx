'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import Link from 'next/link'
import { db } from '@/lib/firebase'
import { ReservationType } from '@/types'
import { ITINERARY } from '@/data/itinerary'
import AuthGuard from '@/components/AuthGuard'

const TYPE_OPTIONS: { value: ReservationType; label: string; icon: string }[] = [
  { value: 'restaurant', label: '餐廳訂位', icon: '🍽️' },
  { value: 'ticket',     label: '門票',     icon: '🎟️' },
  { value: 'hotel',      label: '住宿',     icon: '🏨' },
  { value: 'transport',  label: '交通',     icon: '🚃' },
]

function AddReservationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultDay = Number(searchParams.get('day') ?? '1')

  const [name, setName] = useState('')
  const [type, setType] = useState<ReservationType>('restaurant')
  const [dayNumber, setDayNumber] = useState(defaultDay)
  const [time, setTime] = useState('')
  const [confirmCode, setConfirmCode] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim() || submitting) return
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'reservations'), {
        name: name.trim(),
        type,
        dayNumber,
        time: time.trim() || null,
        confirmCode: confirmCode.trim() || null,
        done: false,
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
        <h1 className="text-2xl font-bold text-gray-900">新增訂位 / 票券</h1>
      </header>

      <div className="px-4 space-y-5 pb-10">
        {/* 類型 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">類型</label>
          <div className="flex gap-2 mt-2">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setType(opt.value)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                  type === opt.value
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'bg-white border-gray-200 text-gray-500'
                }`}
              >
                <span className="text-lg">{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 名稱 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">名稱</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. 中村藤吉訂位、USJ 哈利波特門票..."
            className="w-full mt-2 bg-white rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-rose-400 transition-colors"
          />
        </div>

        {/* Day */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">日期</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {ITINERARY.map((d) => (
              <button
                key={d.dayNumber}
                onClick={() => setDayNumber(d.dayNumber)}
                className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                  dayNumber === d.dayNumber
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                Day {d.dayNumber}・{d.date}
              </button>
            ))}
          </div>
        </div>

        {/* 時間 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">時間（選填）</label>
          <input
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g. 14:00"
            className="w-full mt-2 bg-white rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-rose-400 transition-colors"
          />
        </div>

        {/* 確認碼 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">確認碼（選填）</label>
          <input
            type="text"
            value={confirmCode}
            onChange={(e) => setConfirmCode(e.target.value)}
            placeholder="e.g. #ABC123"
            className="w-full mt-2 bg-white rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-rose-400 font-mono transition-colors"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!name.trim() || submitting}
          className="w-full bg-rose-500 text-white rounded-xl py-4 font-semibold text-base disabled:opacity-40 active:scale-[0.98] transition-all"
        >
          {submitting ? '新增中...' : '新增'}
        </button>
      </div>
    </div>
  )
}

function AddReservationWithSuspense() {
  return (
    <Suspense fallback={<div className="px-5 pt-20 text-center text-sm text-gray-400">載入中...</div>}>
      <AddReservationForm />
    </Suspense>
  )
}

export default function AddReservationPage() {
  return (
    <AuthGuard>
      <AddReservationWithSuspense />
    </AuthGuard>
  )
}
