import type { ReportModel } from './report'

export interface OwnerModel {
    ownerId: string
    name: string
    phoneNumber: string
}

export interface OwnerReportModel extends ReportModel {
    ownerName: string
    patientName: string
    budgetStatus: string
}
