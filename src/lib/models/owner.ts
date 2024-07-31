import type { ReportModel } from './report'

export interface OwnerModel {
    ownerId: string
    name: string
    phoneNumber: string
    whatsapp: boolean
}

export interface OwnerReportModel extends ReportModel {
    reportId: string
    ownerName: string
    patientName: string
    patientId: string
    budgetStatus: string
    createdAt: string
}
