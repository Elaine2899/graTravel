'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Member } from '@/types'
import { MEMBERS } from '@/data/members'
import Link from 'next/link'
import AuthGuard from '@/components/AuthGuard'

const MEMBER_COLOR: Record<Member, string> = {
  YY: 'border-rose-400 bg-rose-50 text-rose-700',
  Wei: 'border-blue-400 bg-blue-50 text-blue-700',
  Rae: 'border-purple-400 bg-purple-50 text-purple-700',
}

function AddExpenseForm() {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [item, setItem] = useState('')
  const [paidBy, setPaidBy] = useState<Member>('YY')
  const [splitAmong, setSplitAmong] = useState<Member[]>(['YY', 'Wei', 'Rae'])
  const [submitting, setSubmitting] = useState(false)

  const toggleSplit = (member: Member) => {
    setSplitAmong((prev) =>
      prev.includes(member)
        ? prev.length > 1 ? prev.filter((m) => m !== member) : prev
        : [...prev, member]
    )
  }

  const handleSubmit = async () => {
    const amountNum = parseInt(amount.replace(/,/g, ''), 10)
    if (!amountNum || !item.trim()) return
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'expenses'), {
        amount: amountNum,
        item: item.trim(),
        paidBy,
        splitAmong,
        createdAt: serverTimestamp(),
      })
      router.push('/expenses')
    } catch {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <header className="px-5 pt-10 pb-4">
        <Link href="/expenses" className="flex items-center gap-1 text-sm text-rose-500 mb-3">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          返回拆帳
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">新增費用</h1>
      </header>

      <div className="px-4 space-y-5">
        {/* 金額 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">金額（日幣 ¥）</label>
          <div className="flex items-center mt-2 bg-white rounded-xl border border-gray-200 px-4 py-3 gap-2">
            <span className="text-xl font-bold text-gray-400">¥</span>
            <input
              type="number"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="flex-1 text-2xl font-bold text-gray-900 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* 品項 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">品項</label>
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="e.g. 清水寺門票、午餐..."
            className="w-full mt-2 bg-white rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-rose-400 transition-colors"
          />
        </div>

        {/* 付款人 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">付款人</label>
          <div className="flex gap-2 mt-2">
            {MEMBERS.map((member) => (
              <button
                key={member}
                onClick={() => setPaidBy(member)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                  paidBy === member
                    ? MEMBER_COLOR[member]
                    : 'border-gray-200 bg-white text-gray-500'
                }`}
              >
                {member}
              </button>
            ))}
          </div>
        </div>

        {/* 分帳成員 */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            分帳成員（{splitAmong.length} 人，每人 ¥{amount ? Math.round(parseInt(amount) / splitAmong.length).toLocaleString() : 0}）
          </label>
          <div className="flex gap-2 mt-2">
            {MEMBERS.map((member) => (
              <button
                key={member}
                onClick={() => toggleSplit(member)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                  splitAmong.includes(member)
                    ? MEMBER_COLOR[member]
                    : 'border-gray-200 bg-white text-gray-400'
                }`}
              >
                {member}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!amount || !item.trim() || submitting}
          className="w-full bg-rose-500 text-white rounded-xl py-4 font-semibold text-base disabled:opacity-40 active:scale-[0.98] transition-all mt-2"
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
      <AddExpenseForm />
    </AuthGuard>
  )
}
