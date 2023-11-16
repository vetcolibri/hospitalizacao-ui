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
    PAID: 'PAGO',
    UNPAID: 'NÃO PAGO',
    PENDING: 'PENDENTE'
}
