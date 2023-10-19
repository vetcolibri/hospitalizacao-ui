import { Either } from './shared/either'

export interface APIError {
    status?: number
    message: string
}

export interface APIResponse {
    status: number
    data: any
}

export interface APIClient {
    get(url: string): Promise<Either<APIError, APIResponse>>
    post(url: string, body: any): Promise<Either<APIError, APIResponse>>
}
