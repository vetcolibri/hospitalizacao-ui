import Measurement from '../domain/Measurement';

export interface MeasurementGateway {
    get(patientId: string, parameter: string): Measurement[];
}
