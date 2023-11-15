import type { Budget, Hospitalization } from '@/models/hospitalization'
import type { APIClient, APIError } from '@/lib/api_client'
import type { Patient } from '@/models/patient'
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
        hospitalizationData: Hospitalization,
        budgetData: Budget
    ): Promise<Either<APIError, void>>
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
        const patientsOrErr = await this.apiClient.get(
            `${this.baseUrl}/${this.resource}/hospitalized`
        )
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
                budget: budgetData
            }
        }
        const responseOrErr = await this.apiClient.post(
            `${this.baseUrl}/${this.resource}/hospitalize`,
            body
        )
        if (responseOrErr.isLeft()) return left(responseOrErr.value)

        return right(undefined)
    }

    async nonHospitalized(): Promise<Either<APIError, Patient[]>> {
        const patientsOrError = await this.apiClient.get(`${this.baseUrl}/${this.resource}/`)
        if (patientsOrError.isLeft()) return left(patientsOrError.value)
        return right(patientsOrError.value.data)
    }

    async newPatient(
        patientData: Patient,
        hospitalizationData: Hospitalization,
        budgetData: Budget
    ): Promise<Either<APIError, void>> {
        const body = {
            patientData: patientData,
            hospitalizationData: {
                ...hospitalizationData,
                budget: budgetData
            }
        }
        const responseOrErr = await this.apiClient.post(
            `${this.baseUrl}/${this.resource}/new-patient`,
            body
        )

        if (responseOrErr.isLeft()) return left(responseOrErr.value)

        return right(undefined)
    }
}
