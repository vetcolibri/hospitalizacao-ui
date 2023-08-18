export interface Measurement {
    readonly patientId: string
    readonly hour: string
    readonly date: string
    readonly value: string
}

export interface Patient {
    id: string,
    name: string,
    specie: string,
    exams?: string[],
    alerts?: Alert[],
    iconUrl: string
}

export interface Alert {
    hour: string,
    rate: number,
    parameters: string[],
    comments: string,
    status: boolean
}

export interface Parameter {
    title: string,
    name: string,
    type?: string,
    helpText?: string,
    isCombox?: boolean,
    options?: string[],
    value?: string
    lastMeasurement?: Measurement
}
