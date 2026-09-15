import type { ApiClient } from '@/lib/apiClient/api_client'
import type { ApiError } from '@/lib/apiClient/api_error'
import type {
    HospitalizationHistoryDetailModel,
    HospitalizationHistorySummaryModel,
    HospitalizationLinkStatusModel
} from '@/lib/models/hospitalization_history'
import type { Either } from '@/lib/shared/either'
import { left, right } from '@/lib/shared/either'

export interface HospitalizationHistoryService {
    listByPatient(
        patientId: string
    ): Promise<Either<ApiError, HospitalizationHistorySummaryModel[]>>
    detail(
        patientId: string,
        hospitalizationId: string
    ): Promise<Either<ApiError, HospitalizationHistoryDetailModel>>
    linkStatus(): Promise<Either<ApiError, HospitalizationLinkStatusModel>>
}

/**
 * RF-15 — leituras autenticadas do histórico. Ficam em `/patients/:id/...`, no
 * mesmo domínio protegido da ficha; nunca no link público do tutor.
 */
export class HospitalizationHistoryServiceImpl implements HospitalizationHistoryService {
    readonly apiClient: ApiClient
    readonly baseUrl: string

    constructor(apiClient: ApiClient, baseUrl: string) {
        this.apiClient = apiClient
        this.baseUrl = baseUrl
    }

    async listByPatient(
        patientId: string
    ): Promise<Either<ApiError, HospitalizationHistorySummaryModel[]>> {
        const url = `${this.baseUrl}/patients/${encodeURIComponent(patientId)}/hospitalizations`

        const resOrErr = await this.apiClient.get(url)
        if (resOrErr.isLeft()) return left(resOrErr.value)

        return right(resOrErr.value.data)
    }

    async detail(
        patientId: string,
        hospitalizationId: string
    ): Promise<Either<ApiError, HospitalizationHistoryDetailModel>> {
        const url = `${this.baseUrl}/patients/${encodeURIComponent(patientId)}/hospitalizations/${encodeURIComponent(
            hospitalizationId
        )}`

        const resOrErr = await this.apiClient.get(url)
        if (resOrErr.isLeft()) return left(resOrErr.value)

        return right(resOrErr.value.data)
    }

    async linkStatus(): Promise<Either<ApiError, HospitalizationLinkStatusModel>> {
        const url = `${this.baseUrl}/hospitalizations/legacy-link-status`

        const resOrErr = await this.apiClient.get(url)
        if (resOrErr.isLeft()) return left(resOrErr.value)

        return right(resOrErr.value.data)
    }
}
