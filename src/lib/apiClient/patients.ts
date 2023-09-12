import { HttpClient } from './http_client'

export class PatientAPI {
    readonly HttpClient: HttpClient
    readonly baseUrl: string

    constructor(httpClient: HttpClient, baseUrl: string) {
        this.HttpClient = httpClient
        this.baseUrl = baseUrl
    }

    async getAllHospitalized(): Promise<any> {
        const patients = await this.HttpClient.get(`${this.baseUrl}/patients/hospitalized`)
        return patients
    }
}
