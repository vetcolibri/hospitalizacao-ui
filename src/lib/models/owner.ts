import type { PatientConditionModel } from './patient_condition'

export interface OwnerModel {
    ownerId: string
    name: string
    phoneNumber: string
}

export interface OwnerReportModel extends PatientConditionModel {
    ownerName: string
    patientName: string
    budgetStatus: string
}
