import type { MeasurementModel } from '@/lib/models/measurement'
import type { ApiClient } from '@/lib/apiClient/api_client'
import type { ApiError } from '../apiClient/api_error'
import type { Either } from '@/lib/shared/either'
import { left, right } from '@/lib/shared/either'

export interface RoundService {
    newRound(patientId: string, measurements: any): Promise<Either<ApiError, void>>
    latestMeasurement(patientId: string): Promise<MeasurementModel[]>
    getAllMeasurement(patientId: string): Promise<MeasurementModel[]>
}

export class RoundServiceImpl implements RoundService {
    readonly apiClient: ApiClient
    readonly baseUrl: string
    readonly resource: string

    constructor(apiClient: ApiClient, baseUrl: string) {
        this.apiClient = apiClient
        this.baseUrl = baseUrl
        this.resource = 'rounds'
    }

    async newRound(patientId: string, measurements: any): Promise<Either<ApiError, void>> {
        const body = { patientId, parameters: measurements }

        const url = `${this.baseUrl}/${this.resource}/new`

        const resOrErr = await this.apiClient.post(url, body)
        if (resOrErr.isLeft()) return left(resOrErr.value)

        return right(undefined)
    }

    async latestMeasurement(patientId: string): Promise<MeasurementModel[]> {
        const url = `${this.baseUrl}/${this.resource}/measurements/latest/${patientId}`

        const resOrErr = await this.apiClient.get(url)
        if (resOrErr.isLeft()) {
            console.error(resOrErr.value)
            return []
        }

        return resOrErr.value.data
    }

    async getAllMeasurement(patientId: string): Promise<MeasurementModel[]> {
        const url = `${this.baseUrl}/${this.resource}/measurements/${patientId}`

        const resOrErr = await this.apiClient.get(url)
        if (resOrErr.isLeft()) {
            console.error(resOrErr.value.message)
            return []
        }

        return resOrErr.value.data
    }
}
