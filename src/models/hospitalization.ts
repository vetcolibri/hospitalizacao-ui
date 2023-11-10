export interface Hospitalization {
    readonly birthDate: string
    readonly weight: number
    readonly complaints: string[]
    readonly diagnostics: string[]
    readonly entryDate: string
    readonly dischargeDate: string
    readonly budget: Budget
}

export interface Budget {
    readonly startDate: string
    readonly endDate: string
    readonly status: string
}
