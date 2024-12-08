import { defineStore } from 'pinia'

export const useCurrentPatient = defineStore('currentPatient', {
    state: () => {
        return {
            patientId: '',
            ownerId: ''
        }
    },
    getters: {
        patient: (state) => {
            return {
                patientId: state.patientId,
                ownerId: state.ownerId
            }
        }
    }
})
