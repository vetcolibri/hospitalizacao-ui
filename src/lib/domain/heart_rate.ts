import { Parameter } from './parameter'

enum Status {
    Normal = 'Normal',
    Bradycardia = 'Bradicardia',
    Tachycardia = 'Taquicardia',
    Invalid = 'Inválido'
}

export class HeartRate extends Parameter {
    status: Status
    max: number
    min: number

    constructor(min: number = 0, max: number = 300) {
        super()
        this.name = 'Frequência Cardiaca'
        this.helpText = '(70 - 120) BPM'
        this.status = Status.Normal
        this.min = min
        this.max = max
    }

    verifyStatus() {
        if (this.isInvalid()) {
            this.status = Status.Invalid
        }

        if (this.isBradycardia()) {
            this.status = Status.Bradycardia
        }

        if (this.isNormal()) {
            this.status = Status.Normal
        }

        this.status = Status.Tachycardia

        return this.status
    }

    get numberValue() {
        return Number(this.value)
    }

    private isInvalid() {
        return this.numberValue < 0
    }

    private isNormal() {
        return this.numberValue >= 70 && this.numberValue <= 120
    }

    private isBradycardia() {
        return this.numberValue >= 0 && this.numberValue < 70
    }
}
