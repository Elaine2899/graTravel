'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// webpack strips _getIconUrl from the bundled leaflet; restore marker icons from CDN
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export interface MapMarker {
  lat: number
  lng: number
  label?: string
}

interface Props {
  center: [number, number]
  markers?: MapMarker[]
  zoom?: number
  className?: string
}

export default function FreeMapInner({ center, markers = [], zoom = 14, className = '' }: Props) {
  return (
    <MapContainer
      center={center as LatLngExpression}
      zoom={zoom}
      scrollWheelZoom={false}
      className={`h-64 w-full rounded-xl ${className}`}
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((m, i) => (
        <Marker key={i} position={[m.lat, m.lng]}>
          {m.label && <Popup>{m.label}</Popup>}
        </Marker>
      ))}
    </MapContainer>
  )
}
