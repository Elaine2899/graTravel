'use client'

import { useState } from 'react'
import { Expense, Member } from '@/types'
import { CATEGORIES, CATEGORY_ORDER, ExpenseCategory } from '@/data/categories'
import { MEMBERS } from '@/data/members'

const MEMBER_COLOR: Record<Member, { text: string; bg: string; bar: string }> = {
  YY:  { text: 'text-rose-600',   bg: 'bg-rose-100',   bar: 'bg-rose-400'   },
  Wei: { text: 'text-blue-600',   bg: 'bg-blue-100',   bar: 'bg-blue-400'   },
  Rae: { text: 'text-purple-600', bg: 'bg-purple-100', bar: 'bg-purple-400' },
}

function getPersonShare(expense: Expense, person: Member): number {
  if (expense.splits && expense.splits[person] != null) return expense.splits[person]!
  if (expense.splitAmong.includes(person)) return expense.amount / expense.splitAmong.length
  return 0
}

interface Props {
  expenses: Expense[]
  fmt: (amount: number) => string
}

export default function SpendingAnalysis({ expenses, fmt }: Props) {
  const [view, setView] = useState<'all' | Member>('all')

  const total = expenses.reduce((s, e) => s + e.amount, 0)

  // ── 總覽計算 ──
  const byCategory: Partial<Record<ExpenseCategory, number>> = {}
  for (const e of expenses) {
    const cat = e.category ?? 'other'
    byCategory[cat] = (byCategory[cat] ?? 0) + e.amount
  }
  const paidByPerson: Record<Member, number> = { YY: 0, Wei: 0, Rae: 0 }
  for (const e of expenses) paidByPerson[e.paidBy] += e.amount

  // ── 個人計算 ──
  const person = view !== 'all' ? view : null
  const personPaid = person ? paidByPerson[person] : 0
  const personOwed = person
    ? expenses.reduce((s, e) => s + getPersonShare(e, person), 0)
    : 0
  const personNet = personPaid - personOwed

  // 個人分攤花費的類別分布
  const personShareByCategory: Partial<Record<ExpenseCategory, number>> = {}
  if (person) {
    for (const e of expenses) {
      const share = getPersonShare(e, person)
      if (share > 0) {
        const cat = e.category ?? 'other'
        personShareByCategory[cat] = (personShareByCategory[cat] ?? 0) + share
      }
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Header tabs */}
      <div className="flex overflow-x-auto scrollbar-none border-b border-gray-100 dark:border-gray-700">
        {(['all', ...MEMBERS] as ('all' | Member)[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`shrink-0 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              view === v
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-gray-400 dark:text-gray-500'
            }`}
          >
            {v === 'all' ? '總覽' : v}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4">
        {view === 'all' ? (
          <>
            {/* 總金額 */}
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">總支出</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">{fmt(total)}</p>
            </div>

            {/* 類別分布 */}
            {total > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">類別分布</p>
                <div className="space-y-2">
                  {CATEGORY_ORDER.filter((c) => byCategory[c]).map((cat) => {
                    const amt = byCategory[cat]!
                    const pct = Math.round((amt / total) * 100)
                    const info = CATEGORIES[cat]
                    return (
                      <div key={cat}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{info.emoji} {info.label}</span>
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {fmt(amt)} <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">{pct}%</span>
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${info.bar}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 各人付出 */}
            {total > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">各人付出</p>
                <div className="space-y-2">
                  {MEMBERS.map((m) => {
                    const amt = paidByPerson[m]
                    const pct = total > 0 ? Math.round((amt / total) * 100) : 0
                    const c = MEMBER_COLOR[m]
                    return (
                      <div key={m}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-semibold ${c.text}`}>{m}</span>
                          <span className="text-sm font-semibold text-gray-800">
                            {fmt(amt)} <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">{pct}%</span>
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {total === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-2">還沒有任何消費記錄</p>
            )}
          </>
        ) : (
          /* 個人視角 */
          <>
            {/* 摘要卡片 */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '個人花費', value: personOwed, color: 'text-gray-700 dark:text-gray-200' },
                { label: '支出費用', value: personPaid, color: MEMBER_COLOR[person!].text },
                {
                  label: personNet >= 0 ? '應收' : '應付',
                  value: Math.abs(personNet),
                  color: personNet > 0 ? 'text-green-600' : personNet < 0 ? 'text-red-500' : 'text-gray-400 dark:text-gray-500',
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{label}</p>
                  <p className={`text-sm font-bold ${color}`}>
                    {fmt(Math.round(value))}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500 text-center -mt-1">
              {personNet > 0
                ? `其他人共欠 ${person} ${fmt(Math.round(personNet))}`
                : personNet < 0
                ? `${person} 還需付出 ${fmt(Math.round(-personNet))}`
                : '已結清 🎉'}
            </p>

            {/* 花費類別分布 */}
            {personOwed > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">花費類別</p>
                <div className="space-y-2">
                  {CATEGORY_ORDER.filter((c) => personShareByCategory[c]).map((cat) => {
                    const amt = personShareByCategory[cat]!
                    const pct = Math.round((amt / personOwed) * 100)
                    const info = CATEGORIES[cat]
                    return (
                      <div key={cat}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{info.emoji} {info.label}</span>
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {fmt(amt)} <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">{pct}%</span>
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${info.bar}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {personOwed === 0 && personPaid === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-2">{person} 尚無消費記錄</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
