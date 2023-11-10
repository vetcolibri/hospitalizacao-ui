import { Hospitalization } from './hospitalization'

export interface Patient {
    patientId: string
    name: string
    specie: string
    breed: string
    ownerId: string
    ownerName: string
    ownerPhoneNumber: string
    hasAlert: boolean
    hospitalization: Hospitalization
}
