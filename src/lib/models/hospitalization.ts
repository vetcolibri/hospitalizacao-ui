export interface HospitalizationModel {
    patientId: string
    hospitalizationId: string
    weight: number
    complaints: string[]
    diagnostics: string[]
    entryDate: string
    dischargeDate?: string
}
