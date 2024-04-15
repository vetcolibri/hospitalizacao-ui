import type { ApiClient } from '@/lib/apiClient/api_client'
import type { ApiError } from '../apiClient/api_error'
import type { Either } from '@/lib/shared/either'
import type { AlertModel } from '@/lib/models/alert'
import { left, right } from '@/lib/shared/either'

export interface AlertService {
    schedule(data: AlertData): Promise<Either<ApiError, void>>
    cancel(alertId: string): Promise<Either<ApiError, void>>
    activeAlerts(): Promise<AlertModel[]>
}

export class AlertServiceImpl implements AlertService {
    readonly apiClient: ApiClient
    readonly baseUrl: string
    readonly resource: string

    constructor(apiClient: ApiClient, baseUrl: string) {
        this.apiClient = apiClient
        this.baseUrl = baseUrl
        this.resource = 'alerts'
    }

    async schedule(data: AlertData): Promise<Either<ApiError, void>> {
        const body = { ...data, patientId: data.patientId }
        const url = `${this.baseUrl}/${this.resource}/schedule`

        const resOrErr = await this.apiClient.post(url, body)
        if (resOrErr.isLeft()) return left(resOrErr.value)

        return right(undefined)
    }

    async cancel(alertId: string): Promise<Either<ApiError, void>> {
        const body = { alertId }

        const url = `${this.baseUrl}/${this.resource}/cancel`

        const resOrErr = await this.apiClient.post(url, body)
        if (resOrErr.isLeft()) return left(resOrErr.value)

        return right(undefined)
    }

    async activeAlerts(): Promise<AlertModel[]> {
        const url = `${this.baseUrl}/${this.resource}/active`

        const resOrErr = await this.apiClient.get(url)
        if (resOrErr.isLeft()) {
            console.error(resOrErr.value.message)
            return []
        }

        return resOrErr.value.data
    }
}

interface AlertData {
    patientId: string
    parameters: string[]
    time: string
    rate: number
    comments: string
}
