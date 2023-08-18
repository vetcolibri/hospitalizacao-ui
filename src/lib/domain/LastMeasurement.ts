import type Measurement from './Measurement';

export class LastMeasurement {
    readonly measurements: Measurement[]

    constructor (){
        this.measurements = []
    }

    execute(patientId: string, parameter: string) {
       
    }
}
