import type { HttpClient } from './http_client'

export class PatientAPI {
    readonly HttpClient: HttpClient
    readonly baseUrl: string
    readonly resource: string

    constructor(httpClient: HttpClient, baseUrl: string) {
        this.HttpClient = httpClient
        this.baseUrl = baseUrl
        this.resource = 'patients'
    }

    async getAllHospitalized(): Promise<any> {
        const patients = await this.HttpClient.get(`${this.baseUrl}/${this.resource}/hospitalized`)
        return patients
    }
}
