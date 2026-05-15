const BASE = 'https://www.google.com/maps'

export function getTransitDirectionsUrl(destination: string, origin?: string): string {
  const params = new URLSearchParams({ api: '1', destination, travelmode: 'transit' })
  if (origin) params.set('origin', origin)
  return `${BASE}/dir/?${params}`
}

export function getWalkingDirectionsUrl(destination: string): string {
  const params = new URLSearchParams({ api: '1', destination, travelmode: 'walking' })
  return `${BASE}/dir/?${params}`
}

export function getStreetViewUrl(lat: number, lng: number): string {
  return `${BASE}?q=${lat},${lng}&layer=c`
}
