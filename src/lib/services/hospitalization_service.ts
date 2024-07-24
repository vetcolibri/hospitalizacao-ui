import type { ApiClient } from '@/lib/apiClient/api_client'
import type { HospitalizationModel } from '@/lib/models/hospitalization'

export interface HospitalizationService {
    getAll(): Promise<HospitalizationModel[]>
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
}
