import { AxiosError } from 'axios'
import axios from 'axios'
import type { ApiClient } from '../apiClient/api_client'
import type { ApiError } from '../apiClient/api_error'
import type { ApiResponse } from '../apiClient/api_response'
import type { Either } from '../shared/either'
import { left, right } from '../shared/either'
import { getToken } from '@/composables/useAuth'


export class AxiosAdapter implements ApiClient {


    async get(url: string, params: any): Promise<Either<ApiError, ApiResponse>> {

        try {
            const response = await axios.get(url, {
                params,
                headers: {
                    "X-Access-Token": getToken()
                }
            })
            return Promise.resolve(right({ status: response.status, data: response.data }))
        } catch (Error) {
            const error = <AxiosError>Error
            const { message } = <ApiError>error.response?.data
            return Promise.resolve(left({ status: error.response?.status, message: message }))
        }
    }

    async post(url: string, body: any): Promise<Either<ApiError, ApiResponse>> {
        try {
            const response = await axios.post(url,
                body,
                {
                    headers: {
                        "X-Access-Token": getToken()
                    }
                }
            )
            return Promise.resolve(right({ status: response.status, data: response.data }))
        } catch (Error) {
            const error = <AxiosError>Error
            const { message } = <ApiError>error.response?.data
            return Promise.resolve(left({ status: error.response?.status, message }))
        }
    }
}
