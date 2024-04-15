export interface AlertModel {
    alertId?: string
    patientId: string
    status: string
    parameters: string[]
    time: string
    rate: number
    comments: string
}
