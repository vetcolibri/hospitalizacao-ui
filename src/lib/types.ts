export interface Patient {
    patientId: string
    name: string
    specie: string
    hasAlert?: boolean
}

export interface Alert {
    alertId: string
    patientId: string
    repeatEvery: number
    parameters: string[]
    comments: string
}

export interface Measurement {
    readonly parameter: string
    readonly value: string
    readonly date?: string
    readonly message?: string
}

export interface Parameter {
    title: string
    name: string
    type?: string
    helpText?: string
    options?: string[]
    measurement?: Measurement
    lastMeasurement?: Measurement
    chooseVisibility?: boolean
}

export interface RepeatEvery {
    rate: number
    unity: string
}
