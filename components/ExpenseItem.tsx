import { Expense } from '@/types'

const MEMBER_COLOR: Record<string, string> = {
  YY: 'bg-rose-100 text-rose-700',
  Wei: 'bg-blue-100 text-blue-700',
  Rae: 'bg-purple-100 text-purple-700',
}

export default function ExpenseItem({ expense }: { expense: Expense }) {
  return (
    <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-800 truncate">{expense.item}</p>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${MEMBER_COLOR[expense.paidBy]}`}>
              {expense.paidBy} 付
            </span>
            <span className="text-xs text-gray-400">
              ÷ {expense.splitAmong.join('・')}
            </span>
          </div>
        </div>
        <p className="text-base font-bold text-gray-900 shrink-0">¥{expense.amount.toLocaleString()}</p>
      </div>
    </div>
  )
}
