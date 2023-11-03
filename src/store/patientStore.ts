import { defineStore } from "pinia";


export const usePatientSelectedStore = defineStore("patientSelected", {
    state: function () {
        return { patientId: ''}
    },
    getters: {
        patient: (state) => state.patientId
    }
})