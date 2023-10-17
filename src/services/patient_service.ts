import type { Hospitalization } from '@/models/hospitalization'
import type { HttpClient } from '@/lib/http_client'
import type { Patient } from '@/models/patient'
import type { Either } from '@/lib/shared/either'
import { left, right } from '@/lib/shared/either'

export interface PatientService {
    getAllHospitalized(): Promise<Patient[]>
    newHospitalization(
        patientId: string,
        data: Partial<Hospitalization>
    ): Promise<Either<Error, void>>
}

export class HttpPatientService implements PatientService {
    readonly HttpClient: HttpClient
    readonly baseUrl: string
    readonly resource: string

    constructor(httpClient: HttpClient, baseUrl: string) {
        this.HttpClient = httpClient
        this.baseUrl = baseUrl
        this.resource = 'patients'
    }

    async getAllHospitalized(): Promise<Patient[]> {
        const patients = await this.HttpClient.get(`${this.baseUrl}/${this.resource}/hospitalized`)
        return patients
    }

    async newHospitalization(
        patientId: string,
        hospitalizationData: Partial<Hospitalization>
    ): Promise<Either<Error, void>> {
        const body = { patientId, hospitalizationData }
        await this.HttpClient.post(`${this.baseUrl}/${this.resource}/hospitalize`, body)
        return Promise.resolve(right(undefined))
    }
}
