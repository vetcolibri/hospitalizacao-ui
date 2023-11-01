export interface Patient {
    patientId: string
    name: string
    specie?: string
    breed?: string
    ownerName?: string
    ownerPhoneNumber?: string
    ownerId?: string
    hasAlert?: boolean
    entryDate?: string
}
