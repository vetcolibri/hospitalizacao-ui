import type { Hospitalization } from './hospitalization'

export interface Patient {
    patientId: string
    name: string
    specie: string
    breed: string | string[]
    birthDate: string
}

export interface Owner {
    ownerId: string
    name: string
    phoneNumber: string
}

export interface PatientHospitalized extends Patient, Hospitalization {
    hasAlert: boolean
}

export interface PatientWithOwner extends Patient {
    ownerId: string
    ownerName: string
    ownerPhoneNumber: string
}
