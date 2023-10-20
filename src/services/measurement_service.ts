import type { Measurement } from '@/models/measurement'
import type { APIClient, APIError } from '@/lib/api_client'
import type { Either } from '@/lib/shared/either'
import { left, right } from '@/lib/shared/either'

export interface MeasurementService {
    newMeasurements(patientId: string, measurements: Measurement[]): Promise<Either<APIError, void>>
    latestMeasurements(patientId: string): Promise<Either<APIError, Measurement[]>>
    getAllMeasurements(patientId: string): Promise<Either<APIError, Measurement[]>>
}

export class MeasurementServiceAPI implements MeasurementService {
    readonly apiClient: APIClient
    readonly baseUrl: string
    readonly resource: string

    constructor(apiClient: APIClient, baseUrl: string) {
        this.apiClient = apiClient
        this.baseUrl = baseUrl
        this.resource = 'measurements'
    }

    async newMeasurements(
        patientId: string,
        measurements: Measurement[]
    ): Promise<Either<APIError, void>> {
        const date = new Date()
        const requestBody = {
            patientId,
            userId: 'some-user-id',
            date: date.toISOString(),
            parameters: measurements
        }
        const resultOrError = await this.apiClient.post(
            `${this.baseUrl}/${this.resource}/`,
            requestBody
        )
        if (resultOrError.isLeft()) {
            return Promise.resolve(left(resultOrError.value))
        }
        return Promise.resolve(right(undefined))
    }

    async latestMeasurements(patientId: string): Promise<Either<APIError, Measurement[]>> {
        const measurementsOrError = await this.apiClient.post(
            `${this.baseUrl}/${this.resource}/latest`,
            {
                patientId
            }
        )
        if (measurementsOrError.isLeft()) {
            return Promise.resolve(left(measurementsOrError.value))
        }
        return Promise.resolve(right(measurementsOrError.value.data))
    }

    async getAllMeasurements(patientId: string): Promise<Either<APIError, Measurement[]>> {
        const measurementsOrError = await this.apiClient.get(
            `${this.baseUrl}/${this.resource}/?patientId=${patientId}`
        )
        if (measurementsOrError.isLeft()) {
            return Promise.resolve(left(measurementsOrError.value))
        }
        return Promise.resolve(measurementsOrError.value.data)
    }
}
