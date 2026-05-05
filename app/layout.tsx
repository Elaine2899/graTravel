import type { Metadata } from 'next'
import './globals.css'
import BottomNav from '@/components/BottomNav'
import { AuthProvider } from '@/lib/AuthContext'

export const metadata: Metadata = {
  title: 'graTravel 🇯🇵',
  description: 'YY・Wei・Rae 日本旅遊 App',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-screen bg-[#f8f7f4]">
        <AuthProvider>
          <main className="max-w-lg mx-auto pb-20 min-h-screen">
            {children}
          </main>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  )
}
