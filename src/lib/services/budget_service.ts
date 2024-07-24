import type { ApiClient } from '@/lib/apiClient/api_client'
import type { BudgetModel } from '@/lib/models/budget'

export interface BudgetService {
    getAll(): Promise<BudgetModel[]>
}

export class BudgetServiceImpl implements BudgetService {
    readonly apiClient: ApiClient
    readonly baseUrl: string
    readonly resource: string

    constructor(apiClient: ApiClient, baseUrl: string) {
        this.apiClient = apiClient
        this.baseUrl = baseUrl
        this.resource = 'budgets'
    }

    async getAll(): Promise<BudgetModel[]> {
        const url = `${this.baseUrl}/${this.resource}/`

        const resOrErr = await this.apiClient.get(url)
        if (resOrErr.isLeft()) {
            console.error(resOrErr.value)
            return []
        }

        return resOrErr.value.data
    }
}
