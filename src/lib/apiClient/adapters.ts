import axios from 'axios'
import { HttpClient } from './http_client'

export class AxiosAdapter implements HttpClient {
    async get(url: string): Promise<any> {
        const response = await axios.get(url)
        return response.data
    }
}
