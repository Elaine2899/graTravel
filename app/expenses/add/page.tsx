'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Member } from '@/types'
import { MEMBERS } from '@/data/members'
import { CATEGORIES, CATEGORY_ORDER, ExpenseCategory } from '@/data/categories'
import { ITINERARY } from '@/data/itinerary'
import Link from 'next/link'
import AuthGuard from '@/components/AuthGuard'
import { Currency } from '@/lib/currency'

const MEMBER_COLOR: Record<Member, string> = {
  YY: 'border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  Wei: 'border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  Rae: 'border-purple-400 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
}

type SplitMode = 'equal' | 'custom'

function AddExpenseForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activityId = searchParams.get('activityId') ?? undefined
  const dayParam = Number(searchParams.get('day') ?? '0')

  // Find activity name for context label
  const activityName = activityId
    ? ITINERARY.flatMap((d) => d.activities).find((a) => a.id === activityId)?.title
    : undefined

  const [currency, setCurrency] = useState<Currency>('JPY')
  const [amount, setAmount] = useState('')
  const [item, setItem] = useState('')
  const [category, setCategory] = useState<ExpenseCategory>('food')
  const [paidBy, setPaidBy] = useState<Member>('YY')
  const [splitMode, setSplitMode] = useState<SplitMode>('equal')
  const [splitAmong, setSplitAmong] = useState<Member[]>(['YY', 'Wei', 'Rae'])
  const [customSplits, setCustomSplits] = useState<Partial<Record<Member, string>>>({
    YY: '', Wei: '', Rae: '',
  })
  const [expenseDate, setExpenseDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [submitting, setSubmitting] = useState(false)

  const totalAmount = parseInt(amount.replace(/,/g, ''), 10) || 0

  const customTotal = Object.values(customSplits).reduce(
    (sum, v) => sum + (parseInt(v || '0', 10) || 0), 0
  )
  const remaining = totalAmount - customTotal

  const toggleSplit = (member: Member) => {
    if (splitMode === 'custom') return
    setSplitAmong((prev) =>
      prev.includes(member)
        ? prev.length > 1 ? prev.filter((m) => m !== member) : prev
        : [...prev, member]
    )
  }

  const handleSubmit = async () => {
    if (!totalAmount || !item.trim()) return

    let payload: Record<string, unknown>

    if (splitMode === 'custom') {
      const splits: Partial<Record<Member, number>> = {}
      for (const m of MEMBERS) {
        const v = parseInt(customSplits[m] || '0', 10)
        if (v > 0) splits[m] = v
      }
      if (Object.keys(splits).length === 0) return
      payload = {
        amount: totalAmount,
        item: item.trim(),
        category,
        paidBy,
        splitAmong: Object.keys(splits),
        splits,
        activityId: activityId ?? null,
        expenseDate,
        createdAt: serverTimestamp(),
      }
    } else {
      payload = {
        amount: totalAmount,
        item: item.trim(),
        category,
        paidBy,
        splitAmong,
        activityId: activityId ?? null,
        expenseDate,
        createdAt: serverTimestamp(),
      }
    }

    setSubmitting(true)
    try {
      await addDoc(collection(db, 'expenses'), { ...payload, currency })
      localStorage.setItem('expenses_currency', currency)
      router.push(dayParam ? `/itinerary` : '/expenses')
    } catch {
      setSubmitting(false)
    }
  }

  const perPerson = splitMode === 'equal' && splitAmong.length > 0
    ? Math.round(totalAmount / splitAmong.length)
    : 0

  return (
    <div>
      <header className="px-5 pt-10 pb-4">
        <Link
          href={dayParam ? '/itinerary' : '/expenses'}
          className="flex items-center gap-1 text-sm text-rose-500 mb-3"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {dayParam ? '返回行程' : '返回拆帳'}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">新增費用</h1>
        {activityName && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">📍 {activityName}</p>
        )}
      </header>

      <div className="px-4 space-y-5">
        {/* 金額 */}
        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              金額（{currency === 'JPY' ? '日幣 ¥' : '台幣 NT$'}）
            </label>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
              {(['JPY', 'TWD'] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                    currency === c ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {c === 'JPY' ? '¥ JPY' : 'NT$ TWD'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 gap-2">
            <span className="text-xl font-bold text-gray-400 dark:text-gray-500">{currency === 'JPY' ? '¥' : 'NT$'}</span>
            <input
              type="number"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="flex-1 text-2xl font-bold text-gray-900 dark:text-gray-50 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* 品項 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">品項</label>
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="e.g. 清水寺門票、午餐..."
            className="w-full mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-rose-400 transition-colors"
          />
        </div>

        {/* 日期 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">日期</label>
          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            min="2026-05-12"
            max="2026-05-19"
            className="w-full mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-rose-400 transition-colors"
          />
        </div>

        {/* 類別 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">類別</label>
          <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-none pb-0.5">
            {CATEGORY_ORDER.map((cat) => {
              const info = CATEGORIES[cat]
              const active = category === cat
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
                    active
                      ? `${info.bg} ${info.text} border-transparent`
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <span className="text-base">{info.emoji}</span>
                  <span>{info.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 付款人 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">付款人</label>
          <div className="flex gap-2 mt-2">
            {MEMBERS.map((member) => (
              <button
                key={member}
                onClick={() => setPaidBy(member)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                  paidBy === member ? MEMBER_COLOR[member] : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}
              >
                {member}
              </button>
            ))}
          </div>
        </div>

        {/* 分帳模式切換 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">分帳方式</label>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setSplitMode('equal')}
              className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-colors ${
                splitMode === 'equal' ? 'bg-gray-800 border-gray-800 text-white dark:bg-gray-200 dark:border-gray-200 dark:text-gray-900' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              均分
            </button>
            <button
              onClick={() => setSplitMode('custom')}
              className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-colors ${
                splitMode === 'custom' ? 'bg-gray-800 border-gray-800 text-white dark:bg-gray-200 dark:border-gray-200 dark:text-gray-900' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              自訂金額
            </button>
          </div>
        </div>

        {/* 均分：選參與成員 */}
        {splitMode === 'equal' && (
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              分帳成員{totalAmount > 0 && splitAmong.length > 0 && `（每人 ${currency === 'JPY' ? '¥' : 'NT$'}${perPerson.toLocaleString()}）`}
            </label>
            <div className="flex gap-2 mt-2">
              {MEMBERS.map((member) => (
                <button
                  key={member}
                  onClick={() => toggleSplit(member)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                    splitAmong.includes(member) ? MEMBER_COLOR[member] : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {member}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 自訂：每人輸入金額 */}
        {splitMode === 'custom' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">各人負擔金額</label>
              {totalAmount > 0 && (
                <span className={`text-xs font-medium ${remaining === 0 ? 'text-green-600' : 'text-orange-500'}`}>
                  {remaining === 0 ? '✓ 金額正確' : remaining > 0 ? `還剩 ${currency === 'JPY' ? '¥' : 'NT$'}${remaining.toLocaleString()}` : `超出 ${currency === 'JPY' ? '¥' : 'NT$'}${(-remaining).toLocaleString()}`}
                </span>
              )}
            </div>
            <div className="space-y-2">
              {MEMBERS.map((member) => (
                <div key={member} className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5">
                  <span className={`text-sm font-semibold w-8 ${MEMBER_COLOR[member].split(' ')[1]}`}>{member}</span>
                  <span className="text-gray-400 dark:text-gray-500 text-sm">{currency === 'JPY' ? '¥' : 'NT$'}</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={customSplits[member] ?? ''}
                    onChange={(e) => setCustomSplits((prev) => ({ ...prev, [member]: e.target.value }))}
                    placeholder="0"
                    className="flex-1 text-sm font-bold text-gray-800 dark:text-gray-100 outline-none bg-transparent"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={
            !totalAmount ||
            !item.trim() ||
            submitting ||
            (splitMode === 'custom' && remaining !== 0)
          }
          className="w-full bg-rose-500 text-white rounded-xl py-4 font-semibold text-base disabled:opacity-40 active:scale-[0.98] transition-all mt-2 mb-10"
        >
          {submitting ? '儲存中...' : '儲存'}
        </button>
      </div>
    </div>
  )
}

export default function AddExpensePage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="px-5 pt-20 text-center text-sm text-gray-400">載入中...</div>}>
        <AddExpenseForm />
      </Suspense>
    </AuthGuard>
  )
}
