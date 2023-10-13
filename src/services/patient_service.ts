import type { Hospitalization } from '@/models/hospitalization'
import type { HttpClient } from '@/lib/http_client'
import type { Patient } from '@/models/patient'

export interface PatientService {
    getAllHospitalized(): Promise<Patient[]>
    newHospitalization(patientId: string, data: Partial<Hospitalization>): Promise<Patient>
}

export class FakePatientService implements PatientService {
    readonly #data: Record<string, Patient> = {}

    constructor() {
        this.#populate()
    }

    getAllHospitalized(): Promise<Patient[]> {
        return Promise.resolve(Object.values(this.#data))
    }

    newHospitalization(patientId: string, data: Partial<Hospitalization>): Promise<Patient> {
        throw new Error('Method not implemented.')
    }

    #populate(): void {
        const patient1 = {
            patientId: 'some-id',
            name: 'Rex',
            specie: 'CANINE',
            dateOfAdmission: '2021-05-01T00:00:00Z',
            hasAlert: true
        }
        this.#data[patient1.patientId] = patient1
    }
}

export class HttpPatientService implements PatientService {
    readonly HttpClient: HttpClient
    readonly baseUrl: string
    readonly resource: string

    constructor(httpClient: HttpClient, baseUrl: string) {
        this.HttpClient = httpClient
        this.baseUrl = baseUrl
        this.resource = 'patients'
    }

    async getAllHospitalized(): Promise<Patient[]> {
        const patients = await this.HttpClient.get(`${this.baseUrl}/${this.resource}/hospitalized`)
        return patients
    }

    newHospitalization(patientId: string, data: Partial<Hospitalization>): Promise<Patient> {
        throw new Error('Method not implemented.')
    }
}
