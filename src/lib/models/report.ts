export type ReportModel = {
    stateOfConsciousness: string[]
    food: {
        types: string[]
        level: string
        datetime: string
    }
    discharge: {
        types: string[]
        aspects: string[]
    }
    comments: string
}
