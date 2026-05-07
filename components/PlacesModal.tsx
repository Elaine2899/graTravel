'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { DynamicPlace, Place, PlaceCategory } from '@/types'

const CAT_ICON: Record<PlaceCategory, string> = {
  food: '🍜',
  attraction: '🗺️',
  shop: '🛍️',
}

const CAT_COLOR: Record<PlaceCategory, string> = {
  food: 'bg-orange-50 border-orange-200',
  attraction: 'bg-amber-50 border-amber-200',
  shop: 'bg-pink-50 border-pink-200',
}

const CAT_ACTIVE: Record<PlaceCategory, string> = {
  food: 'bg-orange-500 text-white border-orange-500',
  attraction: 'bg-amber-500 text-white border-amber-500',
  shop: 'bg-pink-500 text-white border-pink-500',
}

const TAG_COLOR = 'bg-gray-100 text-gray-600'

const CAT_OPTIONS: PlaceCategory[] = ['food', 'attraction', 'shop']

interface Props {
  activityTitle: string
  activityId: string
  places: Place[]
  onClose: () => void
}

export default function PlacesModal({ activityTitle, activityId, places, onClose }: Props) {
  const [dynamicPlaces, setDynamicPlaces] = useState<DynamicPlace[]>([])
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState<PlaceCategory>('food')
  const [newNote, setNewNote] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const q = query(
      collection(db, 'dynamicPlaces'),
      where('activityId', '==', activityId),
      orderBy('createdAt', 'asc')
    )
    return onSnapshot(q, (snap) => {
      setDynamicPlaces(snap.docs.map((d) => ({ id: d.id, ...d.data() } as DynamicPlace)))
    })
  }, [activityId])

  const handleAdd = async () => {
    if (!newName.trim() || adding) return
    setAdding(true)
    await addDoc(collection(db, 'dynamicPlaces'), {
      activityId,
      name: newName.trim(),
      category: newCategory,
      note: newNote.trim() || null,
      createdAt: serverTimestamp(),
    })
    setNewName('')
    setNewNote('')
    setAdding(false)
  }

  const total = places.length + dynamicPlaces.length

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] flex flex-col bg-white rounded-t-3xl max-w-lg mx-auto">
        {/* Header */}
        <div className="shrink-0 pt-3 px-5 pb-4 border-b border-gray-100">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900 text-base">📍 備選地點</h2>
              <p className="text-xs text-gray-400 mt-0.5">{activityTitle} ・ {total} 個選項</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Places list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {total === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">還沒有備選地點，在下方新增！</p>
          )}
          {places.map((place, i) => (
            <div key={`s-${i}`} className={`rounded-xl border p-3 ${CAT_COLOR[place.category]}`}>
              <div className="flex items-start gap-2">
                <span className="text-lg shrink-0 mt-0.5">{CAT_ICON[place.category]}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900">{place.name}</p>
                  {place.note && <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{place.note}</p>}
                  {place.tags && place.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {place.tags.map((tag, j) => (
                        <span key={j} className={`text-xs px-2 py-0.5 rounded-full ${TAG_COLOR}`}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {dynamicPlaces.map((place) => (
            <div key={place.id} className={`rounded-xl border p-3 ${CAT_COLOR[place.category]}`}>
              <div className="flex items-start gap-2">
                <span className="text-lg shrink-0 mt-0.5">{CAT_ICON[place.category]}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900">{place.name}</p>
                  {place.note && <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{place.note}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add form */}
        <div className="shrink-0 border-t border-gray-100 px-4 pt-3 pb-6 space-y-2.5">
          {/* Category picker */}
          <div className="flex gap-2">
            {CAT_OPTIONS.map((cat) => (
              <button
                key={cat}
                onClick={() => setNewCategory(cat)}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                  newCategory === cat ? CAT_ACTIVE[cat] : 'bg-white border-gray-200 text-gray-500'
                }`}
              >
                {CAT_ICON[cat]} {cat === 'food' ? '餐飲' : cat === 'attraction' ? '景點' : '購物'}
              </button>
            ))}
          </div>
          {/* Name + note */}
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="地點名稱..."
            className="w-full bg-gray-50 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-rose-400 transition-colors"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="備注（選填）"
              className="flex-1 bg-gray-50 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-rose-400 transition-colors"
            />
            <button
              onClick={handleAdd}
              disabled={!newName.trim() || adding}
              className="px-4 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-semibold disabled:opacity-40 active:scale-95 transition-all"
            >
              新增
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
