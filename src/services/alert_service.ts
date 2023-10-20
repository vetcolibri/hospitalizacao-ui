import type { APIClient, APIError } from '../lib/api_client'
import type { Either } from '@/lib/shared/either'
import type { Alert } from '@/models/alert'
import { left, right } from '@/lib/shared/either'

export interface AlertService {
    scheduleAlert(alert: Alert): Promise<Either<APIError, void>>
    disableAlert(alertId: string): Promise<Either<APIError, void>>
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

    async scheduleAlert(alert: Alert): Promise<Either<APIError, void>> {
        const resultOrError = await this.apiClient.post(
            `${this.baseUrl}/${this.resource}/schedule`,
            alert
        )
        if (resultOrError.isLeft()) {
            return Promise.resolve(left(resultOrError.value))
        }
        return Promise.resolve(right(undefined))
    }

    async disableAlert(alertId: string): Promise<Either<APIError, void>> {
        const resultOrError = await this.apiClient.post(
            `${this.baseUrl}/${this.resource}/disable`,
            {
                alertId
            }
        )
        if (resultOrError.isLeft()) {
            return Promise.resolve(left(resultOrError.value))
        }
        return Promise.resolve(right(undefined))
    }
}
