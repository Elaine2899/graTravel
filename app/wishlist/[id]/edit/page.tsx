'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import Link from 'next/link'
import { db } from '@/lib/firebase'
import { Member, WishlistItem } from '@/types'
import { MEMBERS } from '@/data/members'
import { SHOPPING_LOCATIONS } from '@/data/locations'
import { ITINERARY } from '@/data/itinerary'
import AuthGuard from '@/components/AuthGuard'

const MEMBER_COLOR: Record<Member, string> = {
  YY:  'border-rose-400 bg-rose-50 text-rose-700',
  Wei: 'border-blue-400 bg-blue-50 text-blue-700',
  Rae: 'border-purple-400 bg-purple-50 text-purple-700',
}

const DAY_THEME = Object.fromEntries(ITINERARY.map((d) => [d.dayNumber, d.theme]))

function EditWishlistForm() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [loadError, setLoadError] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [item, setItem] = useState('')
  const [locationId, setLocationId] = useState<string | null>(null)
  const [store, setStore] = useState('')
  const [dayNumber, setDayNumber] = useState<number | null>(null)
  const [wantedBy, setWantedBy] = useState<Member[]>([])
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getDoc(doc(db, 'wishlist', id)).then((snap) => {
      if (!snap.exists()) { setLoadError(true); return }
      const data = snap.data() as Omit<WishlistItem, 'id'>
      setItem(data.item ?? '')
      setLocationId(data.locationId ?? null)
      setStore(data.store ?? '')
      setDayNumber(data.dayNumber ?? null)
      setWantedBy(data.wantedBy ?? [])
      setNote(data.note ?? '')
      setLoaded(true)
    })
  }, [id])

  const toggleMember = (m: Member) => {
    setWantedBy((prev) =>
      prev.includes(m)
        ? prev.length > 1 ? prev.filter((x) => x !== m) : prev
        : [...prev, m]
    )
  }

  const handlePickLocation = (lid: string, day: number) => {
    if (locationId === lid) {
      setLocationId(null)
    } else {
      setLocationId(lid)
      setDayNumber(day)
    }
  }

  const handleSubmit = async () => {
    if (!item.trim() || wantedBy.length === 0) return
    setSubmitting(true)
    try {
      await updateDoc(doc(db, 'wishlist', id), {
        item: item.trim(),
        locationId: locationId ?? null,
        store: store.trim() || null,
        dayNumber: dayNumber ?? null,
        wantedBy,
        note: note.trim() || null,
      })
      router.push('/wishlist')
    } catch {
      setSubmitting(false)
    }
  }

  const locationsByDay = SHOPPING_LOCATIONS.reduce<Record<number, typeof SHOPPING_LOCATIONS>>((acc, loc) => {
    if (!acc[loc.dayNumber]) acc[loc.dayNumber] = []
    acc[loc.dayNumber].push(loc)
    return acc
  }, {})

  if (loadError) {
    return (
      <div className="px-5 pt-20 text-center">
        <p className="text-gray-500 text-sm">找不到此項目</p>
        <Link href="/wishlist" className="text-rose-500 text-sm mt-2 inline-block">返回購物清單</Link>
      </div>
    )
  }
  if (!loaded) {
    return <div className="px-5 pt-20 text-center text-sm text-gray-400">載入中...</div>
  }

  return (
    <div>
      <header className="px-5 pt-10 pb-4">
        <Link href="/wishlist" className="flex items-center gap-1 text-sm text-rose-500 mb-3">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          返回購物清單
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">編輯願望</h1>
      </header>

      <div className="px-4 space-y-5 pb-10">
        {/* 物品名稱 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">物品名稱</label>
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="e.g. 抹茶點心、藥妝品..."
            className="w-full mt-2 bg-white rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-rose-400 transition-colors"
          />
        </div>

        {/* 誰想買 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">誰想買</label>
          <div className="flex gap-2 mt-2">
            {MEMBERS.map((m) => (
              <button
                key={m}
                onClick={() => toggleMember(m)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                  wantedBy.includes(m) ? MEMBER_COLOR[m] : 'border-gray-200 bg-white text-gray-400'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* 購買景點 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">購買景點（選填）</label>
          <div className="mt-2 space-y-3">
            <button
              onClick={() => { setLocationId(null); setDayNumber(null) }}
              className={`w-full text-left px-3 py-2 rounded-xl border text-sm transition-colors ${
                locationId === null ? 'bg-gray-800 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-500'
              }`}
            >
              不指定
            </button>
            {Object.entries(locationsByDay).map(([day, locs]) => (
              <div key={day}>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-1 mb-1.5">
                  Day {day}・{DAY_THEME[Number(day)]}
                </p>
                <div className="flex flex-wrap gap-2">
                  {locs.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => handlePickLocation(loc.id, loc.dayNumber)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                        locationId === loc.id
                          ? 'bg-rose-500 border-rose-500 text-white'
                          : 'bg-white border-gray-200 text-gray-600'
                      }`}
                    >
                      {loc.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 購買店家 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">購買店家（選填）</label>
          <input
            type="text"
            value={store}
            onChange={(e) => setStore(e.target.value)}
            placeholder="e.g. 中村藤吉、ドン・キホーテ..."
            className="w-full mt-2 bg-white rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-rose-400 transition-colors"
          />
        </div>

        {/* 備注 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">備注（選填）</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="顏色、規格、數量..."
            rows={2}
            className="w-full mt-2 bg-white rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-rose-400 transition-colors resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!item.trim() || wantedBy.length === 0 || submitting}
          className="w-full bg-rose-500 text-white rounded-xl py-4 font-semibold text-base disabled:opacity-40 active:scale-[0.98] transition-all"
        >
          {submitting ? '儲存中...' : '儲存變更'}
        </button>
      </div>
    </div>
  )
}

export default function EditWishlistPage() {
  return (
    <AuthGuard>
      <EditWishlistForm />
    </AuthGuard>
  )
}
