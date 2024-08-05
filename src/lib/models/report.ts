export type DischargeModel = {
    type: string
    aspects: string[]
}

export type ReportModel = {
    stateOfConsciousness: string[]
    food: {
        types: string[]
        level: string
        datetime: string
    }
    discharges: DischargeModel[]
    comments: string
}
