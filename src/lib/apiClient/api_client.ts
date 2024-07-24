import type { ApiResponse } from '@/lib/apiClient/api_response'
import type { Either } from '@/lib/shared/either'
import type { ApiError } from '@/lib/apiClient/api_error'

export interface ApiClient {
    get(url: string, params?: Record<string, any>): Promise<Either<ApiError, ApiResponse>>
    post(url: string, body: any): Promise<Either<ApiError, ApiResponse>>
}
