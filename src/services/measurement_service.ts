import type { Measurement } from '@/models/measurement'
import type { APIClient } from '@/lib/api_client'

export interface MeasurementService {
    newMeasurements(patientId: string, measurements: Measurement[]): Promise<void>
    latestMeasurements(patientId: string): Promise<Measurement[]>
    getAllMeasurements(patientId: string): Promise<Measurement[]>
}

export class HttpMeasurementService implements MeasurementService {
    readonly httpClient: APIClient
    readonly baseUrl: string
    readonly resource: string

    constructor(httpClient: APIClient, baseUrl: string) {
        this.httpClient = httpClient
        this.baseUrl = baseUrl
        this.resource = 'measurements'
    }

    newMeasurements(patientId: string, measurements: Measurement[]) {
        const date = new Date()
        const requestBody = {
            patientId,
            userId: 'some-user-id',
            date: date.toISOString(),
            parameters: measurements
        }
        this.httpClient.post(`${this.baseUrl}/${this.resource}/`, requestBody)
        return Promise.resolve(undefined)
    }

    async latestMeasurements(patientId: string) {
        const response = await this.httpClient.post(`${this.baseUrl}/${this.resource}/latest`, {
            patientId
        })
        return response.data
    }

    async getAllMeasurements(patientId: string) {
        const data = await this.httpClient.get(
            `${this.baseUrl}/${this.resource}/?patientId=${patientId}`
        )
        return data.reverse()
    }
}
