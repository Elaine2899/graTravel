import { Settlement } from '@/types'

const MEMBER_COLOR: Record<string, string> = {
  YY: 'text-rose-600',
  Wei: 'text-blue-600',
  Rae: 'text-purple-600',
}

interface Props {
  settlements: Settlement[]
  fmt: (amount: number) => string
}

export default function SettlementSummary({ settlements, fmt }: Props) {
  if (settlements.length === 0) {
    return (
      <div className="bg-green-50 dark:bg-green-950 rounded-2xl p-4 border border-green-200 dark:border-green-800 text-center">
        <p className="text-sm text-green-700 dark:text-green-300 font-medium">大家都扯平了！🎉</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">結算清單</p>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-gray-800">
        {settlements.map((s, i) => (
          <div key={i} className="flex items-center gap-2 px-4 py-3">
            <span className={`font-semibold text-sm ${MEMBER_COLOR[s.from]}`}>{s.from}</span>
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M14 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={`font-semibold text-sm ${MEMBER_COLOR[s.to]}`}>{s.to}</span>
            <span className="ml-auto text-sm font-bold text-gray-800 dark:text-gray-100">{fmt(s.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
