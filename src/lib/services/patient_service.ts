import type { ApiClient } from '@/lib/apiClient/api_client'
import type { HospitalizationModel } from '@/lib/models/hospitalization'
import type { PatientModel } from '@/lib/models/patient'
import type { Either } from '@/lib/shared/either'
import { left, right } from '@/lib/shared/either'
import type { ApiError } from '../apiClient/api_error'
import type { BudgetModel } from '../models/budget'
import type { OwnerModel } from '../models/owner'
import type { PatientConditionModel } from '../models/patient_condition'

export interface PatientService {
    listHospitalized(): Promise<PatientModel[]>
    listNonHospitalized(): Promise<Either<ApiError, PatientModel[]>>
    newPatient(newPatientData: NewPatientData): Promise<Either<ApiError, void>>
    newHospitalization(
        patientId: string,
        hospitalizationData: HospitalizationModel,
        budgetData: BudgetModel
    ): Promise<Either<ApiError, void>>
    endHospitalization(patientId: string): Promise<Either<ApiError, void>>
    endBudget(
        hospitalizationId: string,
        patientId: string,
        status: string
    ): Promise<Either<ApiError, void>>
    registerCondition(patientId: string, condition: PatientConditionModel): Promise<void>
}

export class PatientServiceImpl implements PatientService {
    readonly apiClient: ApiClient
    readonly baseUrl: string
    readonly resource: string

    constructor(apiClient: ApiClient, baseUrl: string) {
        this.apiClient = apiClient
        this.baseUrl = baseUrl
        this.resource = 'patients'
    }

    async listHospitalized(): Promise<PatientModel[]> {
        const url = `${this.baseUrl}/${this.resource}/hospitalized`

        const resOrErr = await this.apiClient.get(url)
        if (resOrErr.isLeft()) {
            console.error(resOrErr.value)
            alert('Não foi possível carregar os pacientes')
            return []
        }

        return resOrErr.value.data
    }

    async newHospitalization(
        patientId: string,
        hospitalizationData: HospitalizationModel,
        budgetData: BudgetModel
    ): Promise<Either<ApiError, void>> {
        const body = {
            patientId,
            hospitalizationData,
            budgetData
        }

        const url = `${this.baseUrl}/${this.resource}/hospitalize`

        const resOrErr = await this.apiClient.post(url, body)
        if (resOrErr.isLeft()) return left(resOrErr.value)

        return right(undefined)
    }

    async listNonHospitalized(): Promise<Either<ApiError, PatientModel[]>> {
        const url = `${this.baseUrl}/${this.resource}/`

        const resOrErr = await this.apiClient.get(url)
        if (resOrErr.isLeft()) return left(resOrErr.value)

        return right(resOrErr.value.data)
    }

    async newPatient(newPatientData: NewPatientData): Promise<Either<ApiError, void>> {
        const { patientData, hospitalizationData, budgetData, ownerData } = newPatientData
        const body = {
            patientData,
            hospitalizationData,
            budgetData,
            ownerData
        }

        const url = `${this.baseUrl}/${this.resource}/new-patient`

        const resOrErr = await this.apiClient.post(url, body)
        if (resOrErr.isLeft()) return left(resOrErr.value)

        return right(undefined)
    }

    async endHospitalization(patientId: string): Promise<Either<ApiError, void>> {
        const url = `${this.baseUrl}/${this.resource}/end-hospitalization`

        const resOrErr = await this.apiClient.post(url, { patientId })
        if (resOrErr.isLeft()) {
            console.error(resOrErr.value)
            alert('Não foi possível encerrar a hospitalização')
            return left(resOrErr.value)
        }

        alert('Hospitalização encerrada com sucesso')
        return right(undefined)
    }

    async endBudget(
        hospitalizationId: string,
        patientId: string,
        status: string
    ): Promise<Either<ApiError, void>> {
        const url = `${this.baseUrl}/${this.resource}/end-budget`

        const resOrErr = await this.apiClient.post(url, { hospitalizationId, patientId, status })
        if (resOrErr.isLeft()) {
            console.error(resOrErr.value)
            alert('Não foi possível encerrar o orçamento')
            return left(resOrErr.value)
        }

        alert('Orçamento salvo com sucesso')
        return right(undefined)
    }

    async registerCondition(patientId: string, condition: PatientConditionModel): Promise<void> {
        const url = `${this.baseUrl}/${this.resource}/register-condition`

        const resOrErr = await this.apiClient.post(url, { patientId, condition })
        if (resOrErr.isLeft()) {
            console.error(resOrErr.value)
            alert('Não foi possível registrar as informações para o Tutor')
            return
        }

        alert('Informações para o Tutor registradas com sucesso')
    }
}

type PatientData = {
    patientId: string
    name: string
    specie: string
    breed: string
    birthDate: string
}

export type NewPatientData = {
    patientData: PatientData
    ownerData: OwnerModel
    hospitalizationData: HospitalizationModel
    budgetData: BudgetModel
}
