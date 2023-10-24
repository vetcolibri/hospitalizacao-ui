export interface Hospitalization {
    readonly name?: string
    readonly specie?: string
    readonly breed?: string
    readonly ownerId?: string
    readonly ownerName?: string
    readonly ownerPhoneNumber?: string
    readonly age: number
    readonly weight: number
    readonly complaints: string
    readonly diagnostics: string
    readonly entryDate: string
    readonly dischargeDate: string
    readonly estimatedBudgetDate: string
}
