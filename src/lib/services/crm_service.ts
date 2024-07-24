import type { ApiClient } from '@/lib/apiClient/api_client'
import type { ApiError } from '@/lib/apiClient/api_error'
import type { OwnerModel, OwnerReportModel } from '@/lib/models/owner'
import type { ReportModel } from '@/lib/models/report'
import { left, right, type Either } from '@/lib/shared/either'

export interface CrmService {
    getAll(): Promise<OwnerModel[]>
    findOwner(ownerId: string): Promise<Either<ApiError, OwnerModel>>
    registerReport(patientId: string, report: ReportModel): Promise<void>
    lastReport(
        patientId: string,
        ownerId: string,
        hospitalizationId: string
    ): Promise<Either<ApiError, OwnerReportModel>>
}

export class CrmServiceImpl implements CrmService {
    readonly apiClient: ApiClient
    readonly baseUrl: string
    readonly resource: string

    constructor(apiClient: ApiClient, baseUrl: string) {
        this.apiClient = apiClient
        this.baseUrl = baseUrl
        this.resource = 'owners'
    }

    async getAll(): Promise<OwnerModel[]> {
        const url = `${this.baseUrl}/${this.resource}/`

        const resOrErr = await this.apiClient.get(url)
        if (resOrErr.isLeft()) {
            console.error(resOrErr.value)
            return []
        }

        return resOrErr.value.data
    }

    async findOwner(ownerId: string): Promise<Either<ApiError, OwnerModel>> {
        const url = `${this.baseUrl}/${this.resource}/${ownerId}`

        const resOrErr = await this.apiClient.get(url)
        if (resOrErr.isLeft()) return left(resOrErr.value)

        return right(resOrErr.value.data)
    }

    async registerReport(patientId: string, report: ReportModel): Promise<void> {
        const url = `${this.baseUrl}/owners/register-report`

        const resOrErr = await this.apiClient.post(url, { patientId, ...report })
        if (resOrErr.isLeft()) {
            console.error(resOrErr.value)
            alert('Não foi possível registrar as informações para o Tutor')
            return
        }

        alert('Informações para o Tutor registradas com sucesso')
    }

    async lastReport(
        patientId: string,
        ownerId: string,
        hospitalizationId: string
    ): Promise<Either<ApiError, OwnerReportModel>> {
        const url = `${this.baseUrl}/owners/last-report`

        const resOrErr = await this.apiClient.get(url, { patientId, ownerId, hospitalizationId })
        if (resOrErr.isLeft()) {
            alert(resOrErr.value.message)
            return left(resOrErr.value)
        }

        return right(resOrErr.value.data)
    }
}
