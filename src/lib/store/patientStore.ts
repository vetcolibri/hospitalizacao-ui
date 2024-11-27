import { defineStore } from 'pinia'

export const useCurrentPatient = defineStore('currentPatient', {
    state: () => {
        return {
            patientId: '',
            hospitalizationId: '',
            ownerId: ''
        }
    },
    getters: {
        patient: (state) => {
            return {
                patientId: state.patientId,
                hospitalizationId: state.hospitalizationId,
                ownerId: state.ownerId
            }
        }
    }
})
