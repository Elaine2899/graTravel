'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Place, PlaceCategory } from '@/types'

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

const TAG_COLOR = 'bg-gray-100 text-gray-600'

interface Props {
  activityTitle: string
  places: Place[]
  onClose: () => void
}

export default function PlacesModal({ activityTitle, places, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] flex flex-col bg-white rounded-t-3xl max-w-lg mx-auto">
        {/* Header */}
        <div className="shrink-0 pt-3 px-5 pb-4 border-b border-gray-100">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900 text-base">📍 備選地點</h2>
              <p className="text-xs text-gray-400 mt-0.5">{activityTitle} ・ {places.length} 個選項</p>
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
        <div className="overflow-y-auto px-4 py-3 space-y-2">
          {places.map((place, i) => (
            <div key={i} className={`rounded-xl border p-3 ${CAT_COLOR[place.category]}`}>
              <div className="flex items-start gap-2">
                <span className="text-lg shrink-0 mt-0.5">{CAT_ICON[place.category]}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900">{place.name}</p>
                  {place.note && (
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{place.note}</p>
                  )}
                  {place.tags && place.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {place.tags.map((tag, j) => (
                        <span key={j} className={`text-xs px-2 py-0.5 rounded-full ${TAG_COLOR}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>,
    document.body
  )
}
