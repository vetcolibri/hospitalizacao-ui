import { ParameterUnit } from './parameter_unit'
import { Parameter } from './parameter'

enum Option {
    MaiorQue2Segundos = "Maior que 2'",
    MenorQue2Segundos = "Menor que 2'"
}

enum Status {
    Vasoconstricao = 'Vasoconstrição',
    Normal = 'Normal'
}

export class Trc extends Parameter {
    unit: string = ParameterUnit.Trc
    status: Status
    options: string[]

    constructor() {
        super()
        this.title = 'Trc'
        this.name = 'trc'
        this.helpText = "(> 2')"
        this.status = Status.Normal
        this.options = Object.values(Option)
    }

    verifyStatus() {
        if (!this.value) {
            this.status = Status.Normal
            return this.status
        }

        if (this.value === Option.MaiorQue2Segundos) {
            this.status = Status.Vasoconstricao
            return this.status
        }

        this.status = Status.Normal
        return this.status
    }
}
