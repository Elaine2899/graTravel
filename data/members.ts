import { Member } from '@/types'

export const MEMBERS: Member[] = ['YY', 'Wei', 'Rae']

const EMAIL_TO_MEMBER: Record<string, Member> = {
  'YY@gmail.com':  'YY',
  'wei@gmail.com': 'Wei',
  'Rae@gmail.com': 'Rae',
}

export function getMemberFromEmail(email: string | null | undefined): Member | null {
  if (!email) return null
  return EMAIL_TO_MEMBER[email] ?? null
}
