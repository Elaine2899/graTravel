'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Expense } from '@/types'
import { CATEGORIES } from '@/data/categories'

const MEMBER_COLOR: Record<string, string> = {
  YY: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
  Wei: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  Rae: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
}

interface Props {
  expense: Expense
  onDelete: (id: string) => void
  fmt: (amount: number) => string
}

export default function ExpenseItem({ expense, onDelete, fmt }: Props) {
  const [confirming, setConfirming] = useState(false)

  const cat = expense.category ? CATEGORIES[expense.category] : null

  const nativeFmt = (amount: number) =>
    (expense.currency ?? 'JPY') === 'TWD'
      ? `NT$${Math.round(amount).toLocaleString()}`
      : `¥${Math.round(amount).toLocaleString()}`

  const splitDisplay = expense.splits && Object.keys(expense.splits).length > 0
    ? Object.entries(expense.splits)
        .map(([m, amt]) => `${m} ${nativeFmt(amt!)}`)
        .join('・')
    : `÷ ${expense.splitAmong.join('・')} 均分`

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {cat && (
              <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium shrink-0 ${cat.bg} ${cat.text}`}>
                {cat.emoji} {cat.label}
              </span>
            )}
            <p className="font-medium text-sm text-gray-800 dark:text-gray-100 truncate">{expense.item}</p>
          </div>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${MEMBER_COLOR[expense.paidBy]}`}>
              {expense.paidBy} 付
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">{splitDisplay}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <p className="text-base font-bold text-gray-900 dark:text-gray-50">{nativeFmt(expense.amount)}</p>

          <Link
            href={`/expenses/edit?id=${expense.id}`}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 dark:text-gray-600 hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          {confirming ? (
            <div className="flex gap-1">
              <button
                onClick={() => onDelete(expense.id)}
                className="text-xs px-2 py-1 bg-red-500 text-white rounded-lg font-medium"
              >
                確定
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg"
              >
                取消
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
