import type { Owner } from './owner'
import type { Hospitalization } from './hospitalization'

export interface Patient extends Hospitalization {
    systemId: string
    patientId: string
    name: string
    specie: string
    breed: string
    birthDate: string
    owner: Owner
    hasAlert?: boolean
}
