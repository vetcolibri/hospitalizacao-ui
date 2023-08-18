import Measurement from '../domain/Measurement';
import type {MeasurementGateway} from './MeasurementGateway';


export default class MeasurementGatewayHttp implements MeasurementGateway {
    readonly measurements: Measurement[] = [];

    constructor() {
        this.#populate();
    }
    get(patientId: string, parameter: string): Measurement[] {
        return this.measurements
    }

    #populate() {
        const measurement1 = new Measurement('001001:maximus:joao-santos', 'temperature', '35');
        const measurement2 = new Measurement('001001:maximus:joao-santos', 'trc', '1');
        const measurement3 = new Measurement('001001:maximus:joao-santos', 'heartRate', '75');
        const measurement4 = new Measurement('001001:maximus:joao-santos', 'respiratoryRate', '20');
        const measurement5 = new Measurement('001001:maximus:joao-santos', 'mucosas', '140');
        const measurement6 = new Measurement('001001:maximus:joao-santos', 'heartRate', '140');
        const measurement7 = new Measurement('001001:maximus:joao-santos', 'heartRate', '140');
        const measurement8 = new Measurement('001001:maximus:joao-santos', 'heartRate', '140');
        const measurement9 = new Measurement('001001:maximus:joao-santos', 'heartRate', '140');
        this.measurements.push(measurement1, measurement2, measurement3, measurement4, measurement5);
    }
}
