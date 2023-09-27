export interface Patient {
    patientId: string
    name: string
    specie: string
    dateOfAdmission: string
    hasAlert?: boolean
}
