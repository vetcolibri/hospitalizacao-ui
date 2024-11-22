import type { ApiClient } from "../apiClient/api_client";
import type { ApiError } from "../apiClient/api_error";
import type { UserModel } from "../models/user";
import { left, right, type Either } from "../shared/either";


export interface AuthService {
    login(username: string, password: string): Promise<Either<ApiError, UserModel>>
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

    async login(username: string, password: string): Promise<Either<ApiError, UserModel>> {
        const url = `${this.baseUrl}/${this.resource}/login`
        const userOrErr = await this.apiClient.post(url, {username, password})
        if (userOrErr.isLeft()) {
            return left(userOrErr.value)
        }


        return right({
            username: userOrErr.value.data.username,
            token: userOrErr.value.data.token
        })
    }
}
