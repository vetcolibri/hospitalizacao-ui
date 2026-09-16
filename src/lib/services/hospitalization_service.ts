import type { ApiClient } from '@/lib/apiClient/api_client'
import type { ApiError } from '@/lib/apiClient/api_error'
import type { Either } from '@/lib/shared/either'
import { left, right } from '@/lib/shared/either'
import type { HospitalizationModel } from '@/lib/models/hospitalization'
import type {
    RecentHospitalizationModel,
    RecentHospitalizationsFilters
} from '@/lib/models/recent_hospitalization'

export interface HospitalizationService {
    getAll(): Promise<HospitalizationModel[]>
    recent(
        filters: RecentHospitalizationsFilters
    ): Promise<Either<ApiError, RecentHospitalizationModel[]>>
}

export class HospitalizationServiceImpl implements HospitalizationService {
    readonly apiClient: ApiClient
    readonly baseUrl: string
    readonly resource: string

    constructor(apiClient: ApiClient, baseUrl: string) {
        this.apiClient = apiClient
        this.baseUrl = baseUrl
        this.resource = 'hospitalizations'
    }

    async getAll(): Promise<HospitalizationModel[]> {
        const url = `${this.baseUrl}/${this.resource}/`

        const resOrErr = await this.apiClient.get(url)
        if (resOrErr.isLeft()) {
            console.error(resOrErr.value)
            return []
        }

        return resOrErr.value.data
    }

    async recent(
        filters: RecentHospitalizationsFilters
    ): Promise<Either<ApiError, RecentHospitalizationModel[]>> {
        const params = new URLSearchParams()
        if (filters.term) params.set('term', filters.term)
        if (filters.from) params.set('from', filters.from)
        if (filters.to) params.set('to', filters.to)

        const query = params.toString()
        const url = `${this.baseUrl}/${this.resource}/recent${query ? `?${query}` : ''}`

        const resOrErr = await this.apiClient.get(url)
        if (resOrErr.isLeft()) return left(resOrErr.value)

        return right(resOrErr.value.data)
    }
}
