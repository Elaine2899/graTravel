'use client'

import { useEffect, useState } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/AuthContext'
import { MEMBERS, getMemberFromEmail } from '@/data/members'
import { CHECKLIST_ITEMS, CHECKLIST_CATEGORIES } from '@/data/checklist'
import { Member } from '@/types'
import AuthGuard from '@/components/AuthGuard'

const MEMBER_CHECKED: Record<Member, string> = {
  YY:  'bg-rose-500 border-rose-500',
  Wei: 'bg-blue-500 border-blue-500',
  Rae: 'bg-purple-500 border-purple-500',
}
const MEMBER_UNCHECKED: Record<Member, string> = {
  YY:  'border-rose-300',
  Wei: 'border-blue-300',
  Rae: 'border-purple-300',
}
const MEMBER_NAME_COLOR: Record<Member, string> = {
  YY:  'text-rose-600',
  Wei: 'text-blue-600',
  Rae: 'text-purple-600',
}
const MEMBER_PROGRESS_BG: Record<Member, string> = {
  YY:  'bg-rose-100',
  Wei: 'bg-blue-100',
  Rae: 'bg-purple-100',
}
const MEMBER_PROGRESS_FILL: Record<Member, string> = {
  YY:  'bg-rose-500',
  Wei: 'bg-blue-500',
  Rae: 'bg-purple-500',
}

const CRISIS_TIPS = [
  {
    id: 'passport-lost',
    emoji: '📕',
    title: '護照遺失',
    symptoms: [] as string[],
    steps: [
      '冷靜！先徹底確認每個口袋、行李夾層、飯店房間',
      '前往最近的警察局（派出所）報案，取得「遺失證明書（紛失届出証明書）」',
      '聯絡台北駐大阪辦事處（上班時間：週一至週五 09:00–17:00）',
      '準備材料：其他身份證明（學生證 / 駕照）、大頭照 2 張、遺失證明書',
      '申辦「入國證明書」（可緊急當日取件）或補發護照（需 5–10 個工作天）',
      '以「入國證明書」向日本入管局辦理臨時出境手續',
      '通知台灣虎航（+886-2-2717-1230）說明狀況，改簽或保留機位',
    ],
    warning: '不要拖延！越早聯繫辦事處越快解決。緊急時間外撥打辦事處緊急專線。',
    emergency: '台北駐大阪辦事處 +81-6-6443-8481｜緊急（非上班時間）+81-90-2706-1965',
  },
  {
    id: 'heat',
    emoji: '🥵',
    title: '熱衰竭',
    symptoms: ['大量出汗、皮膚濕冷蒼白', '脈搏快而弱、肌肉無力', '頭暈、噁心、頭痛', '體溫升高但未超過 40°C'],
    steps: [
      '立即移至陰涼處或冷氣房',
      '躺下並抬高雙腳',
      '解開緊身衣物',
      '用冷毛巾擦拭頸部、腋下、鼠蹊部',
      '小口補充電解質飲料（寶礦力、OS-1）',
      '不可讓患者獨處',
      '15–30 分鐘未改善 → 撥打 119',
    ],
    warning: '若體溫超過 40°C、意識不清、停止出汗 → 已惡化為中暑，立即 119！',
    emergency: '119（救護車）',
  },
]

function ChecklistContent() {
  const { user } = useAuth()
  const currentMember = getMemberFromEmail(user?.email)
  const [checkedByMember, setCheckedByMember] = useState<Record<Member, string[]>>({
    YY: [], Wei: [], Rae: [],
  })
  const [openCrisis, setOpenCrisis] = useState<string | null>(null)

  const total = CHECKLIST_ITEMS.length

  useEffect(() => {
    const unsubs = MEMBERS.map((m) =>
      onSnapshot(doc(db, 'checklist', m), (snap) => {
        setCheckedByMember((prev) => ({
          ...prev,
          [m]: snap.exists() ? (snap.data().checkedIds as string[] ?? []) : [],
        }))
      })
    )
    return () => unsubs.forEach((u) => u())
  }, [])

  const toggle = async (itemId: string) => {
    if (!currentMember) return
    const current = checkedByMember[currentMember]
    const newIds = current.includes(itemId)
      ? current.filter((id) => id !== itemId)
      : [...current, itemId]
    await setDoc(doc(db, 'checklist', currentMember), { checkedIds: newIds }, { merge: true })
  }

  const itemsByCategory = CHECKLIST_CATEGORIES.reduce<Record<string, typeof CHECKLIST_ITEMS>>(
    (acc, cat) => {
      acc[cat] = CHECKLIST_ITEMS.filter((i) => i.category === cat)
      return acc
    },
    {}
  )

  return (
    <div>
      <header className="px-5 pt-10 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">錦囊</h1>
        <p className="text-xs text-gray-400 mt-1">行前清單 × 危機處理</p>
      </header>

      {/* 三人完成率橫幅 */}
      <div className="mx-4 mb-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex gap-3">
          {MEMBERS.map((m) => {
            const count = checkedByMember[m].filter((id) =>
              CHECKLIST_ITEMS.some((i) => i.id === id)
            ).length
            const pct = Math.round((count / total) * 100)
            return (
              <div key={m} className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-semibold ${MEMBER_NAME_COLOR[m]}`}>{m}</span>
                  <span className="text-[10px] text-gray-500">{count}/{total}</span>
                </div>
                <div className={`h-1.5 rounded-full ${MEMBER_PROGRESS_BG[m]}`}>
                  <div
                    className={`h-1.5 rounded-full transition-all ${MEMBER_PROGRESS_FILL[m]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {count === total && (
                  <p className="text-[10px] text-center mt-0.5">✓ 完成</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 分類清單 */}
      <div className="px-4 space-y-4 pb-4">
        {CHECKLIST_CATEGORIES.map((cat) => (
          <div key={cat}>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">{cat}</p>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
              {itemsByCategory[cat].map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                  <p className="flex-1 text-sm text-gray-800">{item.label}</p>
                  <div className="flex gap-2 shrink-0">
                    {MEMBERS.map((m) => {
                      const checked = checkedByMember[m].includes(item.id)
                      const isMe = m === currentMember
                      return (
                        <button
                          key={m}
                          onClick={() => isMe && toggle(item.id)}
                          disabled={!isMe}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            checked
                              ? MEMBER_CHECKED[m]
                              : `bg-white ${MEMBER_UNCHECKED[m]}`
                          } ${!isMe ? 'cursor-default' : 'active:scale-90'}`}
                        >
                          {checked && (
                            <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3}>
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 危機處理錦囊 */}
      <div className="px-4 pb-28">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">危機處理</p>
        <div className="space-y-2">
          {CRISIS_TIPS.map((tip) => {
            const isOpen = openCrisis === tip.id
            return (
              <div key={tip.id} className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-left"
                  onClick={() => setOpenCrisis(isOpen ? null : tip.id)}
                >
                  <span className="text-2xl">{tip.emoji}</span>
                  <span className="flex-1 text-sm font-semibold text-gray-800">{tip.title}</span>
                  <svg
                    viewBox="0 0 24 24" className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" strokeWidth={2}
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 space-y-3 border-t border-orange-50">
                    {tip.symptoms.length > 0 && (
                      <div className="mt-3">
                        <p className="text-[11px] font-semibold text-orange-400 uppercase tracking-wide mb-1.5">症狀</p>
                        <ul className="space-y-1">
                          {tip.symptoms.map((s, i) => (
                            <li key={i} className="text-sm text-gray-700 flex gap-2">
                              <span className="text-orange-400 shrink-0">•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className={tip.symptoms.length === 0 ? 'mt-3' : ''}>
                      <p className="text-[11px] font-semibold text-orange-400 uppercase tracking-wide mb-1.5">處理步驟</p>
                      <ol className="space-y-1">
                        {tip.steps.map((s, i) => (
                          <li key={i} className="text-sm text-gray-700 flex gap-2">
                            <span className="text-orange-500 font-semibold shrink-0 w-4">{i + 1}.</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="bg-red-50 rounded-xl px-3 py-2.5">
                      <p className="text-xs text-red-600 font-medium leading-relaxed">⚠️ {tip.warning}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">緊急電話</span>
                      <span className="text-sm font-bold text-red-500">{tip.emergency}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function ChecklistPage() {
  return (
    <AuthGuard>
      <ChecklistContent />
    </AuthGuard>
  )
}
