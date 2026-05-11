'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Activity, Member, WishlistItem } from '@/types'
import { MEMBERS } from '@/data/members'
import { getLocationName } from '@/data/locations'
import CulturalNoteModal from './CulturalNoteModal'
import MoodPicker from './MoodPicker'
import WishlistActivityModal from './WishlistActivityModal'

const TYPE_ICON: Record<string, string> = {
  flight: '✈️',
  transport: '🚃',
  attraction: '🗺️',
  food: '🍜',
  hotel: '🏨',
}

const TYPE_COLOR: Record<string, string> = {
  flight: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
  transport: 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700',
  attraction: 'bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800',
  food: 'bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800',
  hotel: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
}

const MEMBER_MOOD_COLOR: Record<Member, string> = {
  YY:  'text-rose-500',
  Wei: 'text-blue-500',
  Rae: 'text-purple-500',
}

interface Props {
  activity: Activity
  onDelete?: () => void
  editHref?: string
  wishlistItems?: WishlistItem[]
  dayNumber?: number
  currentMember?: Member | null
  activityMoods?: Partial<Record<Member, string>>
  totalSpent?: number
}

export default function ActivityItem({
  activity,
  onDelete,
  editHref,
  wishlistItems = [],
  dayNumber = 1,
  currentMember,
  activityMoods,
  totalSpent,
}: Props) {
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [showCulturalNote, setShowCulturalNote] = useState(false)
  const [showWishlist, setShowWishlist] = useState(false)
  const [showMoodPicker, setShowMoodPicker] = useState(false)

  const locationName = getLocationName(activity.id)
  const hasWishlistLocation = locationName !== null

  const { details } = activity
  const hasMainDetails = details && (
    details.transportInfo || details.ticketInfo || (details.recommendations?.length ?? 0) > 0 ||
    (details.foodRecs?.length ?? 0) > 0 || (details.spotRecs?.length ?? 0) > 0 || details.specialties?.length
  )
  const hasCulturalNote = !!details?.culturalNote
  const hasMapQuery = !!details?.mapQuery
  const hasAnyDetails = hasMainDetails || hasCulturalNote || hasWishlistLocation || hasMapQuery

  // Mood chip: show emoji for members who reacted, + for current user if not yet
  const moodChips = MEMBERS.map((m) => {
    const emoji = activityMoods?.[m]
    const isMe = m === currentMember
    if (!emoji && !isMe) return null
    return { m, emoji, isMe }
  }).filter(Boolean) as { m: Member; emoji?: string; isMe: boolean }[]

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
                <p className="font-medium text-sm leading-snug text-gray-800 dark:text-gray-100">{activity.title}</p>
                {hasAnyDetails && (
                  <svg
                    viewBox="0 0 24 24"
                    className={`w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>

              {/* Time + cost */}
              {(activity.time || (totalSpent && totalSpent > 0)) && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  {activity.time && <p className="text-xs text-gray-400 dark:text-gray-500">{activity.time}</p>}
                  {activity.time && totalSpent && totalSpent > 0 && <span className="text-xs text-gray-300 dark:text-gray-600">·</span>}
                  {totalSpent && totalSpent > 0 && (
                    <p className="text-xs text-gray-400 dark:text-gray-500">共 ¥{totalSpent.toLocaleString()}</p>
                  )}
                </div>
              )}

              {/* Mood chips */}
              {moodChips.length > 0 && (
                <div
                  className="flex items-center gap-1.5 mt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {moodChips.map(({ m, emoji, isMe }) => (
                    <button
                      key={m}
                      onClick={() => isMe && setShowMoodPicker((v) => !v)}
                      className={`text-base leading-none transition-transform ${isMe ? 'active:scale-90' : 'cursor-default'} ${!emoji ? 'opacity-40' : ''} ${MEMBER_MOOD_COLOR[m]}`}
                    >
                      {emoji ?? '＋'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </button>

          {/* 編輯 / 刪除按鈕（僅動態行程） */}
          {(onDelete || editHref) && (
            <div className="flex items-center pr-3 gap-1">
              {confirming ? (
                <div className="flex gap-1">
                  <button
                    onClick={() => onDelete?.()}
                    className="text-xs px-2 py-1 bg-red-500 text-white rounded-lg font-medium"
                  >
                    確定
                  </button>
                  <button
                    onClick={() => setConfirming(false)}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <>
                  {editHref && (
                    <Link
                      href={editHref}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 dark:text-gray-600 hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110 16.414H8v-2a2 2 0 01.586-1.414z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => setConfirming(true)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {open && (
          <div className="px-4 pb-4 space-y-3 border-t border-black/5 dark:border-white/10">
            {details?.transportInfo && (
              <section>
                <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mt-3 mb-1.5">交通</h4>
                {details.transportAlt ? (
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] font-semibold text-blue-400 dark:text-blue-300 uppercase tracking-wide">主案</span>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line mt-0.5">{details.transportInfo}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">備案</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-line mt-0.5">{details.transportAlt}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{details.transportInfo}</p>
                )}
              </section>
            )}
            {details?.ticketInfo && (
              <section>
                <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mt-3 mb-1.5">票券資訊</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{details.ticketInfo}</p>
              </section>
            )}
            {details?.recommendations && details.recommendations.length > 0 && (
              <section>
                <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mt-3 mb-1.5">注意事項</h4>
                <ul className="space-y-1">
                  {details.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex gap-2">
                      <span className="text-amber-500 dark:text-amber-400 shrink-0">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {details?.specialties && details.specialties.length > 0 && (
              <section>
                <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mt-3 mb-1.5">特產</h4>
                <div className="flex flex-wrap gap-1.5">
                  {details.specialties.map((s, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300 rounded-lg">{s}</span>
                  ))}
                </div>
              </section>
            )}
            {details?.foodRecs && details.foodRecs.length > 0 && (
              <section>
                <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mt-3 mb-1.5">🍜 推薦吃食</h4>
                <ul className="space-y-2">
                  {details.foodRecs.map((r, i) => (
                    <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                      <a
                        href={r.mapUrl ?? `https://maps.google.com/maps?q=${encodeURIComponent(r.name + ' 京都')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline decoration-gray-300 dark:decoration-gray-600 underline-offset-2"
                      >{r.name}</a>
                      {r.note && <span className="text-gray-400 dark:text-gray-500 text-xs block">{r.note}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {details?.spotRecs && details.spotRecs.length > 0 && (
              <section>
                <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mt-3 mb-1.5">📍 推薦景點</h4>
                <ul className="space-y-2">
                  {details.spotRecs.map((r, i) => (
                    <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">{r.name}</span>
                      {r.note && <span className="text-gray-400 dark:text-gray-500 text-xs block">{r.note}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 mt-2">
              {details?.mapQuery && (
                <a
                  href={`https://maps.google.com/maps?q=${encodeURIComponent(details.mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-xl"
                >
                  🗺
                </a>
              )}
{hasCulturalNote && (
                <button
                  onClick={() => setShowCulturalNote(true)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950 dark:border-amber-800 text-xl"
                >
                  📖
                </button>
              )}
              {hasWishlistLocation && (
                <button
                  onClick={() => setShowWishlist(true)}
                  className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 text-xl"
                >
                  🛍️
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </button>
              )}
              <Link
                href={`/expenses/add?activityId=${activity.id}&day=${dayNumber}`}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-950 dark:border-blue-800 text-xl"
              >
                💰
              </Link>
            </div>
          </div>
        )}
      </div>

      {showCulturalNote && hasCulturalNote && (
        <CulturalNoteModal
          title={activity.title}
          content={details!.culturalNote!}
          source={details?.culturalNoteRef}
          onClose={() => setShowCulturalNote(false)}
        />
      )}
{showWishlist && hasWishlistLocation && (
        <WishlistActivityModal
          activityId={activity.id}
          activityName={locationName!}
          dayNumber={dayNumber}
          items={wishlistItems}
          onClose={() => setShowWishlist(false)}
        />
      )}
      {showMoodPicker && currentMember && (
        <MoodPicker
          member={currentMember}
          activityId={activity.id}
          onClose={() => setShowMoodPicker(false)}
        />
      )}
    </>
  )
}
