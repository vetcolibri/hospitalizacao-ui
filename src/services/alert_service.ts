import type { APIClient, APIError } from '../lib/api_client'
import type { Either } from '@/lib/shared/either'
import type { Alert } from '@/models/alert'
import { left, right } from '@/lib/shared/either'

export interface IAlertService {
    schedule(patientId: string, alertData: Alert): Promise<Either<APIError, void>>
    cancel(alertId: string): Promise<Either<APIError, void>>
}

export class AlertService implements IAlertService {
    readonly apiClient: APIClient
    readonly baseUrl: string
    readonly resource: string

    constructor(apiClient: APIClient, baseUrl: string) {
        this.apiClient = apiClient
        this.baseUrl = baseUrl
        this.resource = 'alerts'
    }

    async schedule(patientId: string, alertData: Alert): Promise<Either<APIError, void>> {
        const body = { patientId, alertData }
        const resultOrError = await this.apiClient.post(
            `${this.baseUrl}/${this.resource}/schedule`,
            body
        )
        if (resultOrError.isLeft()) return left(resultOrError.value)

        return right(undefined)
    }

    async cancel(alertId: string): Promise<Either<APIError, void>> {
        const body = { alertId }
        const resultOrError = await this.apiClient.post(
            `${this.baseUrl}/${this.resource}/cancel`,
            body
        )
        if (resultOrError.isLeft()) return left(resultOrError.value)

        return right(undefined)
    }
}
