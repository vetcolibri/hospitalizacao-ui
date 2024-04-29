import { BudgetStatus } from '../models/budget'

export function budgetColor(value?: string) {
    if (!value) return

    if (BudgetStatus.Paid === value) {
        return { 'badge-success': true }
    }

    if (BudgetStatus.Pending === value || BudgetStatus.PendingWithBudgetSent === value) {
        return { 'badge-warning': true }
    }

    if (BudgetStatus.Unpaid === value) {
        return { 'badge-danger': true }
    }

    return
}
