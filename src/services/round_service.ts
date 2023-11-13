import type { Measurement } from '@/models/measurement'
import type { APIClient as APIClient, APIError } from '@/lib/api_client'
import type { Either } from '@/lib/shared/either'
import { left, right } from '@/lib/shared/either'

export interface IRoundService {
    newRound(patientId: string, measurements: any): Promise<Either<APIError, void>>
    latestMeasurements(patientId: string): Promise<Either<APIError, Measurement[]>>
    getAllMeasurements(patientId: string): Promise<Either<APIError, Measurement[]>>
}

export class RoundService implements IRoundService {
    readonly apiClient: APIClient
    readonly baseUrl: string
    readonly resource: string

    constructor(apiClient: APIClient, baseUrl: string) {
        this.apiClient = apiClient
        this.baseUrl = baseUrl
        this.resource = 'rounds'
    }

    async newRound(patientId: string, measurements: any): Promise<Either<APIError, void>> {
        const body = { patientId, userId: 'some-user-id', parameters: measurements }
        const resultOrError = await this.apiClient.post(
            `${this.baseUrl}/${this.resource}/new`,
            body
        )
        if (resultOrError.isLeft()) return left(resultOrError.value)

        return right(undefined)
    }

    async latestMeasurements(patientId: string): Promise<Either<APIError, Measurement[]>> {
        const measurementsOrError = await this.apiClient.get(
            `${this.baseUrl}/${this.resource}/latest-measurements/${patientId}`
        )
        if (measurementsOrError.isLeft()) return left(measurementsOrError.value)

        return right(measurementsOrError.value.data)
    }

    async getAllMeasurements(patientId: string): Promise<Either<APIError, Measurement[]>> {
        const measurementsOrError = await this.apiClient.get(
            `${this.baseUrl}/${this.resource}/measurements/${patientId}`
        )
        if (measurementsOrError.isLeft()) return left(measurementsOrError.value)

        return right(measurementsOrError.value.data)
    }
}
