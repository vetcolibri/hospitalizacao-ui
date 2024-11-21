import type { ApiClient } from "../apiClient/api_client";
import type { ApiError } from "../apiClient/api_error";
import type { ApiResponse } from "../apiClient/api_response";
import { left, right, type Either } from "../shared/either";


export interface AuthService {
    login(username: string, password: string): Promise<Either<ApiError, ApiResponse>>
    verifyToken(token: string): Promise<Either<ApiError, ApiResponse>>
}

export class AuthServiceImpl implements AuthService  {
    readonly apiClient: ApiClient
    readonly baseUrl: string
    readonly resource: string

    constructor(apiClient: ApiClient, baseUrl: string) {
        this.apiClient = apiClient
        this.baseUrl = baseUrl
        this.resource = "auth"
    }

    async login(username: string, password: string): Promise<Either<ApiError, ApiResponse>> {
        const url = `${this.baseUrl}/${this.resource}/login`
        const userOrErr = await this.apiClient.post(url, {username, password})
        if (userOrErr.isLeft()) {
            return left(userOrErr.value)
        }

        return right(userOrErr.value)
    }


    async verifyToken(token: string): Promise<Either<ApiError, ApiResponse>> {
        const url = `${this.baseUrl}/${this.resource}/verify-token`
        const userOrErr = await this.apiClient.post(url, { token })
        if (userOrErr.isLeft()) {
            return left(userOrErr.value)
        }

        return right(userOrErr.value)
    }

}
