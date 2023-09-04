export interface Patient {
    id: string,
    name: string,
    specie: string,
    hasAlert?: boolean,
}

export interface Alert {
    id: string,
    patientId: string,
    repeatEvery: string,
    parameters: Partial<Parameter>[],
    comments: string,
}

export interface Measurement {
    readonly value: string
    readonly hour: string
    readonly message?: string
}

export interface Parameter {
    title: string,
    name: string,
    type?: string,
    helpText?: string,
    options?: string[],
    measurement?: Measurement,
    lastMeasurement?: Measurement,
}
