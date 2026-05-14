'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { db, auth } from '@/lib/firebase'
import { Expense } from '@/types'
import ExpenseItem from '@/components/ExpenseItem'
import SettlementSummary from '@/components/SettlementSummary'
import SpendingAnalysis from '@/components/SpendingAnalysis'
import { calculateSettlement } from '@/lib/settlement'
import AuthGuard from '@/components/AuthGuard'
import { useAuth } from '@/lib/AuthContext'
import { Currency, DEFAULT_RATE, makeFormatter } from '@/lib/currency'

type Tab = 'list' | 'analysis'

function ExpensesContent() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('list')
  const [currency, setCurrency] = useState<Currency>('JPY')
  const [rate, setRate] = useState(DEFAULT_RATE)

  useEffect(() => {
    const saved = localStorage.getItem('expenses_currency') as Currency | null
    if (saved === 'JPY' || saved === 'TWD') setCurrency(saved)
  }, [])
  const [editingRate, setEditingRate] = useState(false)
  const [rateInput, setRateInput] = useState(String(DEFAULT_RATE))

  useEffect(() => {
    const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setExpenses(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Expense)))
      setLoading(false)
    })
    return unsub
  }, [])

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'expenses', id))
  }

  const commitRate = () => {
    const v = parseFloat(rateInput)
    if (!isNaN(v) && v > 0) setRate(v)
    else setRateInput(String(rate))
    setEditingRate(false)
  }

  const fmt = makeFormatter(currency, rate)
  const settlements = calculateSettlement(expenses, rate)
  const total = expenses.reduce((s, e) => s + ((e.currency ?? 'JPY') === 'TWD' ? e.amount / rate : e.amount), 0)

  const getDateKey = (e: Expense) =>
    e.expenseDate ?? e.createdAt?.toDate().toISOString().slice(0, 10) ?? ''

  const grouped = expenses.reduce<Record<string, Expense[]>>((acc, e) => {
    const key = getDateKey(e)
    if (!acc[key]) acc[key] = []
    acc[key].push(e)
    return acc
  }, {})
  const sortedDates = Object.keys(grouped).filter(Boolean).sort()

  const formatDateHeader = (dateKey: string) => {
    const [y, m, d] = dateKey.split('-').map(Number)
    const dt = new Date(y, m - 1, d)
    const weekdays = ['日', '一', '二', '三', '四', '五', '六']
    return `${m}月${d}日（${weekdays[dt.getDay()]}）`
  }

  return (
    <div>
      <header className="px-5 pt-10 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">拆帳</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              共 {expenses.length} 筆 ・ 合計 {fmt(total)}
            </p>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="text-xs text-gray-400 dark:text-gray-500 mt-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            登出
          </button>
        </div>

        {/* 幣別切換 */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            {(['JPY', 'TWD'] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => { setCurrency(c); localStorage.setItem('expenses_currency', c) }}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  currency === c ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {c === 'JPY' ? '¥ JPY' : 'NT$ TWD'}
              </button>
            ))}
          </div>

          {currency === 'TWD' && (
            <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <span>1¥ =</span>
              {editingRate ? (
                <input
                  type="number"
                  value={rateInput}
                  onChange={(e) => setRateInput(e.target.value)}
                  onBlur={commitRate}
                  onKeyDown={(e) => e.key === 'Enter' && commitRate()}
                  className="w-16 border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5 text-xs text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 outline-none focus:border-rose-400"
                  autoFocus
                  step="0.001"
                />
              ) : (
                <button
                  onClick={() => { setRateInput(String(rate)); setEditingRate(true) }}
                  className="text-gray-600 dark:text-gray-300 font-medium underline decoration-dotted"
                >
                  {rate}
                </button>
              )}
              <span>TWD</span>
            </div>
          )}
        </div>

        {/* 明細 / 分析 tab */}
        <div className="flex gap-1 mt-3 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {([['list', '明細'], ['analysis', '📊 分析']] as [Tab, string][]).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                tab === t ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 space-y-3">
        {tab === 'list' ? (
          <>
            <SettlementSummary settlements={settlements} fmt={fmt} />
            {loading && (
              <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-8">載入中...</p>
            )}
            {!loading && expenses.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">還沒有任何記帳記錄</p>
            )}
            {sortedDates.map((dateKey) => {
              const group = grouped[dateKey]
              const dayTotal = group.reduce(
                (s, e) => s + ((e.currency ?? 'JPY') === 'TWD' ? e.amount / rate : e.amount), 0
              )
              return (
                <div key={dateKey}>
                  <div className="flex items-center gap-2 pt-2 pb-1">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {formatDateHeader(dateKey)}
                    </span>
                    <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                    <span className="text-xs text-gray-400 dark:text-gray-500">{fmt(dayTotal)}</span>
                  </div>
                  <div className="space-y-2">
                    {group.map((expense) => (
                      <ExpenseItem key={expense.id} expense={expense} onDelete={handleDelete} fmt={fmt} />
                    ))}
                  </div>
                </div>
              )
            })}
          </>
        ) : (
          <SpendingAnalysis expenses={expenses} fmt={fmt} />
        )}
      </div>

      {tab === 'list' && (
        <Link
          href="/expenses/add"
          className="fixed bottom-20 right-4 w-14 h-14 bg-rose-500 rounded-full flex items-center justify-center shadow-lg text-white active:scale-95 transition-transform"
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </Link>
      )}
    </div>
  )
}

export default function ExpensesPage() {
  return (
    <AuthGuard>
      <ExpensesContent />
    </AuthGuard>
  )
}
