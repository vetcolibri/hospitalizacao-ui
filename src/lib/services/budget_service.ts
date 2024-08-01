import type { ApiClient } from '@/lib/apiClient/api_client'
import type { ApiError } from '@/lib/apiClient/api_error'
import type { BudgetModel } from '@/lib/models/budget'
import type { Either } from '@/lib/shared/either'

export interface BudgetService {
    getAll(): Promise<BudgetModel[]>
    update(budget: BudgetModel): Promise<void>
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

    async update(budget: BudgetModel): Promise<void> {
        const url = `${this.baseUrl}/${this.resource}/${budget.budgetId}`

        const data = {
            startOn: budget.startOn,
            endOn: budget.endOn
        }

        const resOrErr = await this.apiClient.post(url, data)
        if (resOrErr.isLeft()) {
            alert('Erro ao salvar prorrogação de orçamento')
            console.error(resOrErr.value)
            return
        }

        alert('Orçamento salvo com sucesso')
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
