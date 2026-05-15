'use client'

import dynamic from 'next/dynamic'
import type { MapMarker } from './FreeMapInner'

interface Props {
  center: [number, number]
  markers?: MapMarker[]
  zoom?: number
  className?: string
}

const Map = dynamic(() => import('./FreeMapInner'), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
  ),
})

export default function FreeMap(props: Props) {
  return <Map {...props} />
}
