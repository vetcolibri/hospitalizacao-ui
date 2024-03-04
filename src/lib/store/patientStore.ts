import { defineStore } from 'pinia'

export const usePatientSelectedStore = defineStore('patientSelected', {
    state: () => {
        return { patientId: '' }
    },
    getters: {
        patient: (state) => state.patientId
    }
})
