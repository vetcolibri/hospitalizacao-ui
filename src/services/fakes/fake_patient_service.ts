import { Hospitalization } from '@/models/hospitalization'
import { Patient } from '@/models/patient'
import { PatientService } from '../patient_service'

export class FakePatientService implements PatientService {
    readonly #data: Record<string, Patient> = {}

    constructor() {
        this.#populate()
    }

    getAllHospitalized(): Promise<Patient[]> {
        return Promise.resolve(Object.values(this.#data))
    }

    newHospitalization(patientId: string, data: Partial<Hospitalization>): Promise<any> {
        throw new Error('Method not implemented.')
    }

    #populate(): void {
        const patient1 = {
            patientId: 'some-id',
            name: 'Rex',
            specie: 'CANINE',
            entryDate: '2021-05-01T00:00:00Z',
            hasAlert: true
        }
        this.#data[patient1.patientId] = patient1
    }
}
