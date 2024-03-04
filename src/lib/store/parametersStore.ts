import { defineStore } from 'pinia'

interface ParametersStore {
    parameters: string[]
}

export const useParametersStore = defineStore('parameters', {
    state: (): ParametersStore => {
        return { parameters: [] }
    },
    getters: {
        getParameters: (state) => state.parameters
    },
    actions: {
        clear() {
            this.parameters = []
        }
    }
})
