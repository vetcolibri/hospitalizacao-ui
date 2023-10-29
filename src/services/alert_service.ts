import type { APIClient, APIError } from '../lib/api_client'
import type { Either } from '@/lib/shared/either'
import type { Alert } from '@/models/alert'
import { left, right } from '@/lib/shared/either'

export interface AlertService {
    schedule(patientId: string, alertData: Alert): Promise<Either<APIError, void>>
    cancel(alertId: string): Promise<Either<APIError, void>>
}

export class AlertServiceAPI implements AlertService {
    readonly apiClient: APIClient
    readonly baseUrl: string
    readonly resource: string

    constructor(apiClient: APIClient, baseUrl: string) {
        this.apiClient = apiClient
        this.baseUrl = baseUrl
        this.resource = 'alerts'
    }

    async schedule(patientId: string, alertData: Alert): Promise<Either<APIError, void>> {
        const body = {
            patientId,
            alertData
        }
        const resultOrError = await this.apiClient.post(
            `${this.baseUrl}/${this.resource}/schedule`,
            body
        )
        if (resultOrError.isLeft()) {
            return left(resultOrError.value)
        }
        return right(undefined)
    }

    async cancel(alertId: string): Promise<Either<APIError, void>> {
        const resultOrError = await this.apiClient.post(`${this.baseUrl}/${this.resource}/cancel`, {
            alertId
        })
        if (resultOrError.isLeft()) {
            return left(resultOrError.value)
        }
        return right(undefined)
    }
}
