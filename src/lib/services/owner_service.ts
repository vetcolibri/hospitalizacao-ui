import type { ApiClient } from '../apiClient/api_client'
import type { ApiError } from '../apiClient/api_error'
import type { OwnerModel } from '../models/owner'
import { left, right, type Either } from '../shared/either'

export interface OwnerService {
    getAll(): Promise<OwnerModel[]>
    findOwner(ownerId: string): Promise<Either<ApiError, OwnerModel>>
}

export class OwnerServiceImpl implements OwnerService {
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
}
