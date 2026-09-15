export interface ApiError {
    status?: number
    message: any
    errors?: Array<{
        code: string
        path: string
        message: string
    }>
}
