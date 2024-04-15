import { Parameter } from './parameter'
import { ParameterUnit } from './parameter_unit'

enum Status {
    Normal = 'Normal',
    Hipotensao = 'Hipotensão',
    Hipertensao = 'Hipertensão'
}

export class BloodPressure extends Parameter {
    unit: string = ParameterUnit.BloodPressure
    status: Status

    constructor(min: number = 0, max: number = 300) {
        super()
        this.title = 'Pressão Arterial'
        this.name = 'bloodPressure'
        this.helpText = `Sis/Dis (PAM): (110/70 - 130/80) ${this.unit} - (60)`
        this.status = Status.Normal
        this.min = min
        this.max = max
    }

    verifyStatus() {
        if (!this.value) {
            this.status = Status.Normal
            return this.status
        }

        if (this.isHipotensao()) {
            this.status = Status.Hipotensao
            return this.status
        }

        if (this.isHipertensao()) {
            this.status = Status.Hipertensao
            return this.status
        }

        this.status = Status.Normal
        return this.status
    }

    get dis() {
        return Number(this.convertToArray()[0])
    }

    get sis() {
        return Number(this.convertToArray()[1])
    }

    private isHipotensao() {
        return this.dis < 110 && this.sis < 80
    }

    private isHipertensao() {
        return this.dis >= 140 && this.sis >= 90
    }

    private convertToArray(): string[] {
        return this.value.match(/(\d+)/g)!
    }
}
