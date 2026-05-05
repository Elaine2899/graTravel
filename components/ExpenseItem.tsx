'use client'

import { useState } from 'react'
import { Expense } from '@/types'

const MEMBER_COLOR: Record<string, string> = {
  YY: 'bg-rose-100 text-rose-700',
  Wei: 'bg-blue-100 text-blue-700',
  Rae: 'bg-purple-100 text-purple-700',
}

interface Props {
  expense: Expense
  onDelete: (id: string) => void
}

export default function ExpenseItem({ expense, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false)

  const splitDisplay = expense.splits && Object.keys(expense.splits).length > 0
    ? Object.entries(expense.splits)
        .map(([m, amt]) => `${m} ¥${amt!.toLocaleString()}`)
        .join('・')
    : `÷ ${expense.splitAmong.join('・')} (均分)`

  return (
    <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-800 truncate">{expense.item}</p>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${MEMBER_COLOR[expense.paidBy]}`}>
              {expense.paidBy} 付
            </span>
            <span className="text-xs text-gray-400">{splitDisplay}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <p className="text-base font-bold text-gray-900">¥{expense.amount.toLocaleString()}</p>

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
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg"
              >
                取消
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
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
