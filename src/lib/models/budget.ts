export interface BudgetModel {
    budgetId: string
    startOn: string
    endOn: string
    status: string
    hospitalizationId: string
}

export enum BudgetStatus {
    Paid = 'PAGO',
    Unpaid = 'NÃO PAGO',
    Pending = 'PENDENTE',
    PendingWithBudgetSent = 'PENDENTE (ORÇAMENTO ENVIADO)'
}
