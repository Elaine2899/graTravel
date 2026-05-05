import { Member } from '@/types'

export const MEMBERS: Member[] = ['YY', 'Wei', 'Rae']

const EMAIL_TO_MEMBER: Record<string, Member> = {
  'elaine.zheng.yyi@gmail.com': 'YY',
  // add Wei and Rae's emails here when known
}

export function getMemberFromEmail(email: string | null | undefined): Member | null {
  if (!email) return null
  return EMAIL_TO_MEMBER[email] ?? null
}
