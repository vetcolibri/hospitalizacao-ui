export interface HospitalizationModel {
    patientId: string
    hospitalizationId: string
    weight: number
    status: string
    complaints: string[]
    diagnostics: string[]
    entryDate: string
    dischargeDate?: string
}
