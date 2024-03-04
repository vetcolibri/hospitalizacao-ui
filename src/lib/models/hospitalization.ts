export interface Hospitalization {
    weight: number
    complaints: string[]
    diagnostics: string[]
    entryDate: string
    dischargeDate: string
}

export interface Budget {
    startOn: string
    endOn: string
    status: string
}

export const BudgetStatus = {
    Paid: 'PAGO',
    Unpaid: 'NÃO PAGO',
    Pending: 'PENDENTE',
    PendingWithBudgetSent: 'PENDENTE (ORÇAMENTO ENVIADO)'
}
