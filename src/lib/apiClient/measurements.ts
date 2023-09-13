import type { Measurement } from '../types'
import type { HttpClient } from './http_client'

export class MeasurementAPI {
    readonly httpClient: HttpClient
    readonly baseUrl: string
    readonly resource: string

    constructor(httpClient: HttpClient, baseUrl: string) {
        this.httpClient = httpClient
        this.baseUrl = baseUrl
        this.resource = 'measurements'
    }

    newMeasurements(patientId: string, measurements: Measurement[]) {
        const date = new Date()
        const requestBody = {
            patientId,
            userId: 'some-user-id',
            data: date,
            measurements
        }
        this.httpClient.post(`${this.baseUrl}/${this.resource}`, requestBody)
    }

    async latestMeasurements(patientId: string) {
        const { data } = await this.httpClient.post(`${this.baseUrl}/${this.resource}/latest`, {
            patientId
        })
        return data
    }
}
