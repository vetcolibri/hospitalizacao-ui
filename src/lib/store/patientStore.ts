import { defineStore } from 'pinia'
import type { ContactModel } from '@/lib/models/contact'

export const useCurrentPatient = defineStore('currentPatient', {
    state: () => {
        return {
            patientId: '',
            ownerId: '',
            // Excepção da hospitalização activa, quando existe (RF-13). O contacto
            // efectivo é resolvido a partir dela; o tutor continua global.
            contact: undefined as ContactModel | undefined
        }
    },
    getters: {
        patient: (state) => {
            return {
                patientId: state.patientId,
                ownerId: state.ownerId,
                contact: state.contact
            }
        }
    }
})
