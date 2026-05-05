export type ExpenseCategory = 'food' | 'transport' | 'ticket' | 'shopping' | 'hotel' | 'other'

export const CATEGORIES: Record<ExpenseCategory, { label: string; emoji: string; bg: string; text: string; bar: string }> = {
  food:     { label: '餐飲', emoji: '🍜', bg: 'bg-orange-100', text: 'text-orange-700', bar: 'bg-orange-400' },
  transport:{ label: '交通', emoji: '🚃', bg: 'bg-blue-100',   text: 'text-blue-700',   bar: 'bg-blue-400'   },
  ticket:   { label: '門票', emoji: '🎫', bg: 'bg-amber-100',  text: 'text-amber-700',  bar: 'bg-amber-400'  },
  shopping: { label: '購物', emoji: '🛍️', bg: 'bg-pink-100',   text: 'text-pink-700',   bar: 'bg-pink-400'   },
  hotel:    { label: '住宿', emoji: '🏨', bg: 'bg-green-100',  text: 'text-green-700',  bar: 'bg-green-400'  },
  other:    { label: '其他', emoji: '📦', bg: 'bg-gray-100',   text: 'text-gray-600',   bar: 'bg-gray-400'   },
}

export const CATEGORY_ORDER: ExpenseCategory[] = ['food', 'transport', 'ticket', 'shopping', 'hotel', 'other']
