import { Timestamp } from 'firebase/firestore'
import { ExpenseCategory } from '@/data/categories'

export type ActivityType = 'transport' | 'attraction' | 'food' | 'hotel' | 'flight'
export type Group = 'all' | 'YY+Rae' | 'Wei'
export type Member = 'YY' | 'Wei' | 'Rae'

export type PlaceCategory = 'food' | 'attraction' | 'shop'

export interface Place {
  name: string
  category: PlaceCategory
  note?: string
  tags?: string[]
}

export interface ActivityDetails {
  culturalNote?: string
  ticketInfo?: string
  transportInfo?: string
  recommendations?: string[]
  places?: Place[]
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
  // Custom splits: each member's exact share. If absent, split equally among splitAmong.
  splits?: Partial<Record<Member, number>>
  createdAt: Timestamp
}

export interface Settlement {
  from: Member
  to: Member
  amount: number
}
