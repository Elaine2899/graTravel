import { Timestamp } from 'firebase/firestore'

export type ActivityType = 'transport' | 'attraction' | 'food' | 'hotel' | 'flight'
export type Group = 'all' | 'YY+Rae' | 'Wei'
export type Member = 'YY' | 'Wei' | 'Rae'

export interface ActivityDetails {
  culturalNote?: string
  ticketInfo?: string
  transportInfo?: string
  recommendations?: string[]
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
  paidBy: Member
  splitAmong: Member[]
  createdAt: Timestamp
}

export interface Settlement {
  from: Member
  to: Member
  amount: number
}
