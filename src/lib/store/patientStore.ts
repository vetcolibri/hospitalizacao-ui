import { defineStore } from 'pinia'

export const useCurrentPatient = defineStore('currentPatient', {
    state: () => {
        return { patientId: '' }
    },
    getters: {
        patient: (state) => state.patientId
    }
})
