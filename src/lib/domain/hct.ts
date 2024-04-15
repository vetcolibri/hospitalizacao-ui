import { Parameter } from './parameter'
import { ParameterUnit } from './parameter_unit'

enum Status {
    Normal = 'Normal'
}

export class Hct extends Parameter {
    unit: string = ParameterUnit.Hct
    status: Status
    type: string

    constructor(min: number = 0, max: number = 100) {
        super()
        this.title = 'Hct'
        this.name = 'hct'
        this.type = 'number'
        this.helpText = `Canino (37 - 55) ${this.unit} Felino (24 - 45) ${this.unit}`
        this.status = Status.Normal
        this.min = min
        this.max = max
    }
}
