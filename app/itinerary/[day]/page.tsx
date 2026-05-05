import { redirect } from 'next/navigation'
import { ITINERARY } from '@/data/itinerary'

export function generateStaticParams() {
  return ITINERARY.map((day) => ({ day: String(day.dayNumber) }))
}

export default function DayPage() {
  redirect('/itinerary')
}
