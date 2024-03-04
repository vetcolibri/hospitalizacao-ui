import type { Measurement } from '@/lib/models/measurement'
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
        const body = { patientId, parameters: measurements }

        const url = `${this.baseUrl}/${this.resource}/new`

        const responseOrError = await this.apiClient.post(url, body)
        if (responseOrError.isLeft()) return left(responseOrError.value)

        return right(undefined)
    }

    async latestMeasurements(patientId: string): Promise<Either<APIError, Measurement[]>> {
        const url = `${this.baseUrl}/${this.resource}/measurements/latest/${patientId}`

        const responseOrError = await this.apiClient.get(url)
        if (responseOrError.isLeft()) return left(responseOrError.value)

        return right(responseOrError.value.data)
    }

    async getAllMeasurements(patientId: string): Promise<Either<APIError, Measurement[]>> {
        const url = `${this.baseUrl}/${this.resource}/measurements/${patientId}`

        const measurementsOrError = await this.apiClient.get(url)
        if (measurementsOrError.isLeft()) return left(measurementsOrError.value)

        return right(measurementsOrError.value.data)
    }
}
