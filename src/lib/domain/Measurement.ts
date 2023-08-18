export default class Measurement {
    readonly patientId: string;
    readonly hour: string = '';
    readonly date: string = '';
    readonly value: string;
    readonly parameter: string;

    constructor(patientId: string, parameter: string, value: string) {
        this.patientId = patientId;
        this.hour = '14:50';
        this.date = '18 ago 2023';
        this.value = value;
        this.parameter = parameter;
    }
}
