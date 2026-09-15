import type { BudgetModel } from './budget'
import type { ContactModel } from './contact'
import type { HospitalizationModel } from './hospitalization'

/** RF-15 — uma entrada do histórico (sem dados clínicos). */
export interface HospitalizationHistorySummaryModel {
    hospitalizationId: string
    entryDate: string
    dischargeDate?: string
    status: string
}

export interface HistoryMeasurementModel {
    name: string
    value: unknown
    issuedAt: string
}

export interface HistoryRoundModel {
    roundId: string
    issuedAt?: string
    measurements: HistoryMeasurementModel[]
}

export interface HistoryReportModel {
    reportId: string
    createdAt: string
    stateOfConsciousness: string[]
    food: {
        types: string[]
        level: string
        datetime: string
    }
    discharges: { type: string; aspects: string[] }[]
    comments: string
}

/** RF-15 — detalhe de UM episódio, em modo de leitura. */
export interface HospitalizationHistoryDetailModel {
    hospitalization: HospitalizationModel
    budget: BudgetModel | null
    rounds: HistoryRoundModel[]
    reports: HistoryReportModel[]
    /** Contacto efectivamente usado no episódio. */
    contact: ContactModel | null
    contactIsSpecific: boolean
}

/** RF-15 — diagnóstico do legado por classificar (não é histórico de ninguém). */
export interface HospitalizationLinkStatusModel {
    reportsWithoutHospitalization: number
    roundsWithoutHospitalization: number
}
