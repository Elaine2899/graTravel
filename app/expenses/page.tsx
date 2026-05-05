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

type Tab = 'list' | 'analysis'

function ExpensesContent() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('list')

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

  const settlements = calculateSettlement(expenses)
  const total = expenses.reduce((s, e) => s + e.amount, 0)

  return (
    <div>
      <header className="px-5 pt-10 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">拆帳</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              共 {expenses.length} 筆 ・ 合計 ¥{total.toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="text-xs text-gray-400 mt-2 px-3 py-1.5 rounded-lg bg-gray-100"
          >
            登出
          </button>
        </div>
        {user?.email && (
          <p className="text-xs text-gray-400 mt-1">登入為 {user.email}</p>
        )}

        {/* 明細 / 分析 tab */}
        <div className="flex gap-1 mt-3 bg-gray-100 rounded-xl p-1">
          {([['list', '明細'], ['analysis', '📊 分析']] as [Tab, string][]).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
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
            <SettlementSummary settlements={settlements} />

            {loading && (
              <p className="text-center text-sm text-gray-400 py-8">載入中...</p>
            )}
            {!loading && expenses.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">還沒有任何記帳記錄</p>
            )}
            {expenses.map((expense) => (
              <ExpenseItem key={expense.id} expense={expense} onDelete={handleDelete} />
            ))}
          </>
        ) : (
          <SpendingAnalysis expenses={expenses} />
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
