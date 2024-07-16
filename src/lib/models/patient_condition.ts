export type PatientConditionModel = {
    stateOfConsciousness: string[]
    food: {
        type: string[]
        level: string
        datetime: string
    }
    discharges: {
        type: string
        aspect: string
    }
    comments: string
}
