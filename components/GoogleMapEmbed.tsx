'use client'

import { useState } from 'react'

interface Props {
  lat: number
  lng: number
  label?: string
  zoom?: number
  className?: string
}

const fallbackUrl = (lat: number, lng: number) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=transit`

export default function GoogleMapEmbed({ lat, lng, label, zoom = 15, className = '' }: Props) {
  const [loading, setLoading] = useState(false)
  const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`

  function handleTap() {
    // Must open window synchronously inside click handler to avoid popup blockers
    const win = window.open('', '_blank')
    if (!win) return

    setLoading(true)

    if (!navigator.geolocation) {
      win.location.href = fallbackUrl(lat, lng)
      setLoading(false)
      return
    }

    const timer = setTimeout(() => {
      win.location.href = fallbackUrl(lat, lng)
      setLoading(false)
    }, 5000)

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        clearTimeout(timer)
        win.location.href =
          `https://www.google.com/maps/dir/?api=1` +
          `&origin=${coords.latitude},${coords.longitude}` +
          `&destination=${lat},${lng}&travelmode=transit`
        setLoading(false)
      },
      () => {
        clearTimeout(timer)
        win.location.href = fallbackUrl(lat, lng)
        setLoading(false)
      },
      { timeout: 5000, maximumAge: 60000 },
    )
  }

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      <iframe
        src={embedUrl}
        className="w-full h-48 border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={label}
      />
      <button
        onClick={handleTap}
        className={`absolute inset-0 w-full transition-colors ${loading ? 'bg-black/10' : 'bg-transparent'}`}
        aria-label={`導航至${label ?? '此地點'}`}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
              <div className="w-3 h-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <span className="text-xs font-medium text-gray-700">定位中…</span>
            </div>
          </div>
        )}
      </button>
    </div>
  )
}
