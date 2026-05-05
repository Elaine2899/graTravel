'use client'

import { useState } from 'react'
import { Activity } from '@/types'
import CulturalNoteModal from './CulturalNoteModal'
import PlacesModal from './PlacesModal'

const TYPE_ICON: Record<string, string> = {
  flight: '✈️',
  transport: '🚃',
  attraction: '🗺️',
  food: '🍜',
  hotel: '🏨',
}

const TYPE_COLOR: Record<string, string> = {
  flight: 'bg-blue-50 border-blue-200',
  transport: 'bg-gray-50 border-gray-200',
  attraction: 'bg-amber-50 border-amber-200',
  food: 'bg-orange-50 border-orange-200',
  hotel: 'bg-green-50 border-green-200',
}

interface Props {
  activity: Activity
  onDelete?: () => void
}

export default function ActivityItem({ activity, onDelete }: Props) {
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [showCulturalNote, setShowCulturalNote] = useState(false)
  const [showPlaces, setShowPlaces] = useState(false)

  const { details } = activity
  const hasMainDetails = details && (
    details.transportInfo || details.ticketInfo || (details.recommendations?.length ?? 0) > 0
  )
  const hasCulturalNote = !!details?.culturalNote
  const hasPlaces = (details?.places?.length ?? 0) > 0
  const hasAnyDetails = hasMainDetails || hasCulturalNote || hasPlaces

  return (
    <>
      <div className={`rounded-xl border ${TYPE_COLOR[activity.type]} overflow-hidden`}>
        <div className="flex items-stretch">
          <button
            className="flex-1 flex items-start gap-3 px-4 py-3 text-left"
            onClick={() => hasAnyDetails && setOpen((o) => !o)}
          >
            <span className="text-xl mt-0.5 shrink-0">{TYPE_ICON[activity.type]}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-sm leading-snug text-gray-800">{activity.title}</p>
                {hasAnyDetails && (
                  <svg
                    viewBox="0 0 24 24"
                    className={`w-4 h-4 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              {activity.time && (
                <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
              )}
            </div>
          </button>

          {/* 刪除按鈕（僅動態行程顯示） */}
          {onDelete && (
            <div className="flex items-center pr-3">
              {confirming ? (
                <div className="flex gap-1">
                  <button
                    onClick={() => onDelete()}
                    className="text-xs px-2 py-1 bg-red-500 text-white rounded-lg font-medium"
                  >
                    確定
                  </button>
                  <button
                    onClick={() => setConfirming(false)}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirming(true)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {open && details && (
          <div className="px-4 pb-4 space-y-3 border-t border-black/5">
            {details.transportInfo && (
              <section>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-3 mb-1.5">交通資訊</h4>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{details.transportInfo}</p>
              </section>
            )}
            {details.ticketInfo && (
              <section>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-3 mb-1.5">票券資訊</h4>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{details.ticketInfo}</p>
              </section>
            )}
            {details.recommendations && details.recommendations.length > 0 && (
              <section>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-3 mb-1.5">推薦 / 注意</h4>
                <ul className="space-y-1">
                  {details.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-amber-500 shrink-0">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 備選地點 + 文史知識 buttons */}
            <div className="flex gap-2 mt-2">
              {hasPlaces && (
                <button
                  onClick={() => setShowPlaces(true)}
                  className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"
                >
                  <span>📍</span>
                  <span>備選地點（{details.places!.length}）</span>
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 ml-auto" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
              {hasCulturalNote && (
                <button
                  onClick={() => setShowCulturalNote(true)}
                  className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium"
                >
                  <span>📖</span>
                  <span>文史知識</span>
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 ml-auto" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {showCulturalNote && hasCulturalNote && (
        <CulturalNoteModal
          title={activity.title}
          content={details!.culturalNote!}
          onClose={() => setShowCulturalNote(false)}
        />
      )}
      {showPlaces && hasPlaces && (
        <PlacesModal
          activityTitle={activity.title}
          places={details!.places!}
          onClose={() => setShowPlaces(false)}
        />
      )}
    </>
  )
}
