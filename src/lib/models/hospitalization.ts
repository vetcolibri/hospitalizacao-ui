import type { ContactModel } from './contact'

export interface HospitalizationModel {
    patientId: string
    hospitalizationId: string
    weight: number
    status: string
    complaints: string[]
    diagnostics: string[]
    entryDate: string
    dischargeDate?: string
    /** Excepção opcional ao tutor principal, só para este episódio (RF-13). */
    contact?: ContactModel
}
