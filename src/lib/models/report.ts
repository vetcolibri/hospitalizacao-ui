export type ReportModel = {
    stateOfConsciousness: string[]
    food: {
        types: string[]
        level: string
        datetime: string
    }
    discharge: {
        type: string
        aspect: string
    }
    comments: string
}
