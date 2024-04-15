import { Parameter } from './parameter'
import { ParameterUnit } from './parameter_unit'

enum Status {
    Bradipenia = 'Bradipnéia',
    Taquipneia = 'Taquipnéia',
    Normal = 'Normal'
}

export class RespiratoryRate extends Parameter {
    unit: string = ParameterUnit.RespiratoryRate
    status: Status
    type: string

    constructor(max: number = 100, min: number = 0) {
        super()
        this.name = 'respiratoryRate'
        this.title = 'Frequência Respiratória'
        this.type = 'number'
        this.helpText = `(10 - 30) ${this.unit}`
        this.status = Status.Normal
        this.max = max
        this.min = min
    }

    verifyStatus() {
        if (!this.value) {
            this.status = Status.Normal
            return this.status
        }

        if (this.isBradpneia()) {
            this.status = Status.Bradipenia
            return this.status
        }

        if (this.isTaquipneia()) {
            this.status = Status.Taquipneia
            return this.status
        }

        this.status = Status.Normal
        return this.status
    }

    private isTaquipneia() {
        return this.numberValue > 30 && this.numberValue <= 100
    }

    private isBradpneia() {
        return this.numberValue >= 0 && this.numberValue <= 9
    }
}
