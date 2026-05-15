'use client'

interface Props {
  lat: number
  lng: number
  label?: string
  zoom?: number
  className?: string
}

export default function GoogleMapEmbed({ lat, lng, label, zoom = 15, className = '' }: Props) {
  const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`
  const mapsUrl  = `https://www.google.com/maps?q=${lat},${lng}`

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      <iframe
        src={embedUrl}
        className="w-full h-48 border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={label}
      />
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0"
        aria-label={`在 Google Maps 開啟${label ? ` ${label}` : ''}`}
      />
    </div>
  )
}
