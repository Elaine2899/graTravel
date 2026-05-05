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

  // 個人付出的類別分布
  const personByCategory: Partial<Record<ExpenseCategory, number>> = {}
  if (person) {
    for (const e of expenses.filter((e) => e.paidBy === person)) {
      const cat = e.category ?? 'other'
      personByCategory[cat] = (personByCategory[cat] ?? 0) + e.amount
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header tabs */}
      <div className="flex overflow-x-auto scrollbar-none border-b border-gray-100">
        {(['all', ...MEMBERS] as ('all' | Member)[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`shrink-0 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              view === v
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-gray-400'
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
              <p className="text-xs text-gray-400 mb-0.5">總支出</p>
              <p className="text-2xl font-bold text-gray-900">{fmt(total)}</p>
            </div>

            {/* 類別分布 */}
            {total > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">類別分布</p>
                <div className="space-y-2">
                  {CATEGORY_ORDER.filter((c) => byCategory[c]).map((cat) => {
                    const amt = byCategory[cat]!
                    const pct = Math.round((amt / total) * 100)
                    const info = CATEGORIES[cat]
                    return (
                      <div key={cat}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">{info.emoji} {info.label}</span>
                          <span className="text-sm font-semibold text-gray-800">
                            {fmt(amt)} <span className="text-xs text-gray-400 font-normal">{pct}%</span>
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
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
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">各人付出</p>
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
                            {fmt(amt)} <span className="text-xs text-gray-400 font-normal">{pct}%</span>
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {total === 0 && (
              <p className="text-sm text-gray-400 text-center py-2">還沒有任何消費記錄</p>
            )}
          </>
        ) : (
          /* 個人視角 */
          <>
            {/* 摘要卡片 */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '付出', value: personPaid, color: MEMBER_COLOR[person!].text },
                { label: '應付', value: personOwed, color: 'text-gray-700' },
                {
                  label: '淨值',
                  value: Math.abs(personNet),
                  color: personNet >= 0 ? 'text-green-600' : 'text-red-500',
                  prefix: personNet >= 0 ? '+' : '-',
                },
              ].map(({ label, value, color, prefix }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className={`text-sm font-bold ${color}`}>
                    {prefix ?? ''}{fmt(Math.round(value))}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 text-center -mt-1">
              {personNet > 0
                ? `其他人共欠 ${person} ${fmt(Math.round(personNet))}`
                : personNet < 0
                ? `${person} 還需付出 ${fmt(Math.round(-personNet))}`
                : '已結清 🎉'}
            </p>

            {/* 付出類別分布 */}
            {personPaid > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">付出類別</p>
                <div className="space-y-2">
                  {CATEGORY_ORDER.filter((c) => personByCategory[c]).map((cat) => {
                    const amt = personByCategory[cat]!
                    const pct = Math.round((amt / personPaid) * 100)
                    const info = CATEGORIES[cat]
                    return (
                      <div key={cat}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">{info.emoji} {info.label}</span>
                          <span className="text-sm font-semibold text-gray-800">
                            {fmt(amt)} <span className="text-xs text-gray-400 font-normal">{pct}%</span>
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${info.bar}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {personPaid === 0 && personOwed === 0 && (
              <p className="text-sm text-gray-400 text-center py-2">{person} 尚無消費記錄</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
