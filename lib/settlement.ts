import { Expense, Member, Settlement } from '@/types'
import { MEMBERS } from '@/data/members'

export function calculateSettlement(expenses: Expense[]): Settlement[] {
  const balance: Record<Member, number> = { YY: 0, Wei: 0, Rae: 0 }

  for (const expense of expenses) {
    balance[expense.paidBy] += expense.amount

    if (expense.splits && Object.keys(expense.splits).length > 0) {
      // Custom split: each member owes their explicit share
      for (const [member, share] of Object.entries(expense.splits)) {
        balance[member as Member] -= share!
      }
    } else {
      // Equal split among splitAmong
      const share = expense.amount / expense.splitAmong.length
      for (const member of expense.splitAmong) {
        balance[member] -= share
      }
    }
  }

  // Minimum transactions greedy
  const creditors = MEMBERS.filter((m) => balance[m] > 0.01).map((m) => ({ member: m, amount: balance[m] }))
  const debtors = MEMBERS.filter((m) => balance[m] < -0.01).map((m) => ({ member: m, amount: -balance[m] }))

  const settlements: Settlement[] = []
  let i = 0, j = 0

  while (i < creditors.length && j < debtors.length) {
    const transfer = Math.min(creditors[i].amount, debtors[j].amount)
    settlements.push({
      from: debtors[j].member,
      to: creditors[i].member,
      amount: Math.round(transfer),
    })
    creditors[i].amount -= transfer
    debtors[j].amount -= transfer
    if (creditors[i].amount < 0.01) i++
    if (debtors[j].amount < 0.01) j++
  }

  return settlements
}
