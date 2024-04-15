import { Parameter } from './parameter'
import { ParameterUnit } from './parameter_unit'

enum Status {
    Normal = 'Normal',
    Hipotermia = 'Hipotermia',
    Hipertermia = 'Hipertermia'
}

export class Temperature extends Parameter {
    unit: string = ParameterUnit.Temperature
    status: Status
    type: string

    constructor(min: number = 0, max: number = 100) {
        super()
        this.title = 'Temperatura'
        this.name = 'temperature'
        this.type = 'number'
        this.helpText = `(37.5 - 39) ${this.unit}`
        this.status = Status.Normal
        this.min = min
        this.max = max
    }

    verifyStatus() {
        if (!this.value) {
            this.status = Status.Normal
            return this.status
        }

        if (this.isHipotermia()) {
            this.status = Status.Hipotermia
            return this.status
        }

        if (this.isHipertermia()) {
            this.status = Status.Hipertermia
            return this.status
        }

        this.status = Status.Normal
        return this.status
    }

    private isHipotermia() {
        return this.numberValue < 37.5
    }

    private isHipertermia() {
        return this.numberValue > 39
    }
}
