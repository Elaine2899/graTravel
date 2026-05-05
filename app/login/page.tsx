'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) return
    setLoading(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.replace('/itinerary')
    } catch {
      setError('帳號或密碼錯誤')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#f8f7f4]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-4xl mb-2">🇯🇵</p>
          <h1 className="text-2xl font-bold text-gray-900">graTravel</h1>
          <p className="text-sm text-gray-400 mt-1">YY・Wei・Rae 日本旅遊</p>
        </div>

        <div className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-white rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none focus:border-rose-400 transition-colors"
            autoComplete="email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密碼"
            className="w-full bg-white rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none focus:border-rose-400 transition-colors"
            autoComplete="current-password"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          {error && <p className="text-sm text-rose-500 text-center">{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full bg-rose-500 text-white rounded-xl py-3.5 font-semibold text-sm disabled:opacity-40 active:scale-[0.98] transition-all mt-1"
          >
            {loading ? '登入中...' : '登入'}
          </button>
        </div>
      </div>
    </div>
  )
}
