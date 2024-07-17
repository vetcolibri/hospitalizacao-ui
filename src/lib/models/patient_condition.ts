export type PatientConditionModel = {
    stateOfConsciousness: string[]
    food: {
        types: string[]
        level: string
        datetime: string
    }
    discharges: {
        type: string
        aspect: string
    }
    comments: string
}
