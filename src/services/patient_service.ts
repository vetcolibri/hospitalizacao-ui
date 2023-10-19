import type { Hospitalization } from '@/models/hospitalization'
import type { APIClient, APIError } from '@/lib/api_client'
import type { Patient } from '@/models/patient'
import type { Either } from '@/lib/shared/either'
import { left, right } from '@/lib/shared/either'

export interface PatientService {
    getAllHospitalized(): Promise<Either<APIError, Patient[]>>
    newHospitalization(
        patientId: string,
        data: Partial<Hospitalization>
    ): Promise<Either<APIError, void>>
    findPatientById(patientId: string): Promise<Either<APIError, Patient>>
}

export class PatientServiceAPI implements PatientService {
    readonly apiClient: APIClient
    readonly baseUrl: string
    readonly resource: string

    constructor(apiClient: APIClient, baseUrl: string) {
        this.apiClient = apiClient
        this.baseUrl = baseUrl
        this.resource = 'patients'
    }

    async getAllHospitalized(): Promise<Either<APIError, Patient[]>> {
        const patientsOrErr = await this.apiClient.get(
            `${this.baseUrl}/${this.resource}/hospitalized`
        )
        if (patientsOrErr.isLeft()) {
            return Promise.resolve(left(patientsOrErr.value))
        }
        const patients = patientsOrErr.value.data
        return Promise.resolve(right(patients))
    }

    async newHospitalization(
        patientId: string,
        hospitalizationData: Partial<Hospitalization>
    ): Promise<Either<APIError, void>> {
        const body = { patientId, hospitalizationData }
        const responseOrErr = await this.apiClient.post(
            `${this.baseUrl}/${this.resource}/hospitalize`,
            body
        )
        if (responseOrErr.isLeft()) {
            return Promise.resolve(left(responseOrErr.value))
        }
        return Promise.resolve(right(undefined))
    }

    async findPatientById(patientId: string): Promise<Either<APIError, Patient>> {
        const patientOrErr = await this.apiClient.get(
            `${this.baseUrl}/${this.resource}/${patientId}`
        )
        if (patientOrErr.isLeft()) {
            return Promise.resolve(left(patientOrErr.value))
        }
        const patient = patientOrErr.value.data
        return Promise.resolve(right(patient))
    }
}
