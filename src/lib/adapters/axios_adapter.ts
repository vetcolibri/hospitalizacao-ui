import { AxiosError } from 'axios'
import axios from 'axios'
import type { APIClient, APIError, APIResponse } from '../api_client'
import type { Either } from '../shared/either'
import { left, right } from '../shared/either'

export class AxiosAdapter implements APIClient {
    async get(url: string): Promise<Either<APIError, APIResponse>> {
        try {
            const response = await axios.get(url)
            return Promise.resolve(right({ status: response.status, data: response.data }))
        } catch (Error) {
            const error = <AxiosError>Error
            const { message } = <APIError>error.response?.data
            return Promise.resolve(left({ status: error.response?.status, message: message }))
        }
    }

    async post(url: string, body: any): Promise<Either<APIError, APIResponse>> {
        try {
            const response = await axios.post(url, body)
            return Promise.resolve(right({ status: response.status, data: response.data }))
        } catch (Error) {
            const error = <AxiosError>Error
            const { message } = <APIError>error.response?.data
            return Promise.resolve(left({ status: error.response?.status, message }))
        }
    }
}
