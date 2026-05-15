import { Timestamp } from 'firebase/firestore'
import { ExpenseCategory } from '@/data/categories'

export type ActivityType = 'transport' | 'attraction' | 'food' | 'hotel' | 'flight'
export type Group = 'all' | 'YY+Rae' | 'Wei'
export type Member = 'YY' | 'Wei' | 'Rae'

export interface FoodRec {
  name: string
  note?: string
  mapUrl?: string
}

export interface SpotRec {
  name: string
  note?: string
}

export interface ActivityDetails {
  culturalNote?: string
  culturalNoteRef?: string
  ticketInfo?: string
  transportInfo?: string
  transportAlt?: string
  recommendations?: string[]
  specialties?: string[]
  foodRecs?: FoodRec[]
  spotRecs?: SpotRec[]
  mapQuery?: string
  coordinates?: { lat: number; lng: number }
  googleMapsUrl?: string
}

export interface Activity {
  id: string
  time?: string
  title: string
  type: ActivityType
  group?: Group
  details?: ActivityDetails
}

export interface Day {
  dayNumber: number
  date: string
  weekday: string
  theme: string
  activities: Activity[]
}

export interface Expense {
  id: string
  amount: number
  item: string
  category?: ExpenseCategory
  paidBy: Member
  splitAmong: Member[]
  splits?: Partial<Record<Member, number>>
  activityId?: string
  currency?: 'JPY' | 'TWD'
  createdAt: Timestamp
  expenseDate?: string
}

export interface Settlement {
  from: Member
  to: Member
  amount: number
}


export interface WishlistItem {
  id: string
  item: string
  dayNumber?: number
  locationId?: string   // activity id from SHOPPING_LOCATIONS
  location?: string     // legacy free text fallback
  store?: string
  wantedBy: Member[]
  purchased: boolean
  note?: string
  createdAt: Timestamp
}
