import { Parameter } from './parameter'
import { ParameterUnit } from './parameter_unit'

enum Status {
    Normal = 'Normal',
    Hipoglicemia = 'Hipoglicemia',
    Hiperglicemia = 'Hiperglicemia'
}

export class BloodGlucose extends Parameter {
    unit: string = ParameterUnit.BloodGlucose
    status: Status
    type: string

    constructor(min: number = 0, max: number = 1000) {
        super()
        this.title = 'Glicemia'
        this.name = 'bloodGlucose'
        this.type = 'number'
        this.helpText = `(60 - 100) ${this.unit}`
        this.status = Status.Normal
        this.min = min
        this.max = max
    }

    verifyStatus() {
        if (!this.value) {
            this.status = Status.Normal
            return this.status
        }

        if (this.isHipoglicemia()) {
            this.status = Status.Hipoglicemia
            return this.status
        }

        if (this.isHiperglicemia()) {
            this.status = Status.Hiperglicemia
            return this.status
        }

        this.status = Status.Normal
        return this.status
    }

    private isHipoglicemia() {
        return this.numberValue < 60
    }

    private isHiperglicemia() {
        return this.numberValue > 100
    }
}
