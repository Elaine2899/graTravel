'use client'

import Link from 'next/link'

const SECTIONS = [
  {
    emoji: '🗓',
    title: '行程',
    items: [
      { label: '切換日期', desc: '上方 Day tab 點選要看的那天，App 會自動跳到今天。' },
      { label: '展開行程卡', desc: '點行程卡本體，展開交通資訊、餐廳推薦、景點推薦、注意事項。' },
      { label: '📖 文史知識', desc: '重要景點附有歷史小故事，點底部「了解更多」可開外部延伸閱讀。' },
      { label: '🗺 地圖', desc: '直接開 Google Maps 導航到該景點。' },
      { label: '💰 記帳', desc: '快速新增這個景點的花費，自動帶入景點名稱。' },
      { label: '😊 心情', desc: '點自己的心情格子選 emoji，三人互看彼此當下感受。' },
      { label: '📷 相簿', desc: '每天標題列右側有相簿連結，點開當日 Google Drive 資料夾。' },
      { label: '＋ 新增行程', desc: '右下角紅色按鈕可新增臨時行程，包含時間、類型、備注。動態新增的行程可用鉛筆圖示編輯、垃圾桶刪除。' },
      { label: '📝 今日日記', desc: '行程列表最底部可寫當天日記，三人各自撰寫，互相看得到彼此的紀錄。' },
    ],
  },
  {
    emoji: '💸',
    title: '拆帳',
    items: [
      { label: '新增費用', desc: '記錄金額、項目、付款人，選擇由哪些人分攤（可自訂各人金額）。' },
      { label: '連結景點', desc: '新增時可選對應景點，費用會顯示在行程卡上方。' },
      { label: '結算', desc: '頁面底部自動計算最少轉帳筆數，顯示誰要付給誰多少錢。' },
    ],
  },
  {
    emoji: '🛍️',
    title: '購物清單',
    items: [
      { label: '新增願望', desc: '記錄想買的東西、預計購買的景點/店家，標記由誰想要。' },
      { label: '打勾完成', desc: '買到了就點打勾，已購和未購分開顯示。' },
      { label: '景點內清單', desc: '景點卡展開後可點 🛍️ 按鈕，直接看這個地方的購物清單。' },
    ],
  },
  {
    emoji: '📋',
    title: '錦囊',
    items: [
      { label: '行前清單', desc: '出發前三人各自對照打勾，上方進度條即時顯示三人完成率。' },
      { label: '危機處理', desc: '護照遺失、熱衰竭的緊急處理步驟與緊急電話，展開即可查看。' },
    ],
  },
]

export default function HelpPage() {
  return (
    <div className="pb-28">
      <header className="px-5 pt-10 pb-4">
        <Link href="/itinerary" className="flex items-center gap-1 text-sm text-rose-500 mb-3">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          返回行程
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">使用說明</h1>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">YY・Wei・Rae 日本行 2026/5/12–5/19</p>
      </header>

      <div className="px-4 space-y-5">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
              {section.emoji} {section.title}
            </p>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm divide-y divide-gray-50 dark:divide-gray-800">
              {section.items.map((item) => (
                <div key={item.label} className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-rose-50 dark:bg-rose-950 rounded-2xl border border-rose-100 dark:border-rose-800 px-4 py-3">
          <p className="text-xs text-rose-600 dark:text-rose-300 leading-relaxed">
            各人的打勾、心情、日記都是即時同步的，換裝置登入也看得到。
          </p>
        </div>
      </div>
    </div>
  )
}
