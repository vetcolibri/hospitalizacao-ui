import type { Budget, Hospitalization } from '@/models/hospitalization'
import type { APIClient, APIError } from '@/lib/api_client'
import type { Owner, Patient } from '@/models/patient'
import type { Either } from '@/lib/shared/either'
import { left, right } from '@/lib/shared/either'

export interface IPatientService {
    getAllHospitalized(): Promise<Either<APIError, Patient[]>>
    newHospitalization(
        patientId: string,
        hospitalizationData: Hospitalization,
        budgetData: Budget
    ): Promise<Either<APIError, void>>
    nonHospitalized(): Promise<Either<APIError, Patient[]>>
    newPatient(
        patientData: Patient,
        ownData: Owner,
        hospitalizationData: Hospitalization,
        budgetData: Budget
    ): Promise<Either<APIError, void>>
    findOwner(ownerId: string): Promise<Either<APIError, Owner>>
}

export class PatientService implements IPatientService {
    readonly apiClient: APIClient
    readonly baseUrl: string
    readonly resource: string

    constructor(apiClient: APIClient, baseUrl: string) {
        this.apiClient = apiClient
        this.baseUrl = baseUrl
        this.resource = 'patients'
    }

    async getAllHospitalized(): Promise<Either<APIError, Patient[]>> {
        const url = `${this.baseUrl}/${this.resource}/hospitalized`

        const patientsOrErr = await this.apiClient.get(url)
        if (patientsOrErr.isLeft()) return left(patientsOrErr.value)

        return right(patientsOrErr.value.data)
    }

    async newHospitalization(
        patientId: string,
        hospitalizationData: Hospitalization,
        budgetData: Budget
    ): Promise<Either<APIError, void>> {
        const body = {
            patientId,
            hospitalizationData: {
                ...hospitalizationData,
                budgetData: budgetData
            }
        }

        const url = `${this.baseUrl}/${this.resource}/hospitalize`

        const responseOrErr = await this.apiClient.post(url, body)
        if (responseOrErr.isLeft()) return left(responseOrErr.value)

        return right(undefined)
    }

    async nonHospitalized(): Promise<Either<APIError, Patient[]>> {
        const url = `${this.baseUrl}/${this.resource}/`

        const patientsOrError = await this.apiClient.get(url)
        if (patientsOrError.isLeft()) return left(patientsOrError.value)

        return right(patientsOrError.value.data)
    }

    async newPatient(
        patientData: Patient,
        ownerData: Owner,
        hospitalizationData: Hospitalization,
        budgetData: Budget
    ): Promise<Either<APIError, void>> {
        const body = {
            patientData,
            hospitalizationData: {
                ...hospitalizationData,
                budgetData: budgetData
            },
            ownerData
        }

        const url = `${this.baseUrl}/${this.resource}/new-patient`

        const responseOrErr = await this.apiClient.post(url, body)
        if (responseOrErr.isLeft()) return left(responseOrErr.value)

        return right(undefined)
    }

    async findOwner(ownerId: string): Promise<Either<APIError, Owner>> {
        const url = `${this.baseUrl}/${this.resource}/owner/${ownerId}`

        const responsOrError = await this.apiClient.get(url)
        if (responsOrError.isLeft()) return left(responsOrError.value)

        return right(responsOrError.value.data)
    }
}
