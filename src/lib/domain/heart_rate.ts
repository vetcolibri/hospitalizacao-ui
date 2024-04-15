import { Parameter } from './parameter'
import { ParameterUnit } from './parameter_unit'

enum Status {
    Normal = 'Normal',
    Bradycardia = 'Bradicardia',
    Tachycardia = 'Taquicardia',
    Invalid = 'Inválido'
}

export class HeartRate extends Parameter {
    unit: string = ParameterUnit.HeartRate
    status: Status
    type: string

    constructor(min: number = 0, max: number = 300) {
        super()
        this.title = 'Frequência Cardiaca'
        this.name = 'heartRate'
        this.type = 'number'
        this.helpText = `(70 - 120) ${this.unit}`
        this.status = Status.Normal
        this.min = min
        this.max = max
    }

    verifyStatus() {
        if (!this.value) {
            this.status = Status.Normal
            return this.status
        }

        if (this.isBradycardia()) {
            this.status = Status.Bradycardia
            return this.status
        }

        if (this.isNormal()) {
            this.status = Status.Normal
            return this.status
        }

        this.status = Status.Tachycardia
        return this.status
    }

    private isNormal() {
        return this.numberValue >= 70 && this.numberValue <= 120
    }

    private isBradycardia() {
        return this.numberValue >= 0 && this.numberValue < 70
    }
}
