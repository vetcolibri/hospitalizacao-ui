import { Parameter } from './parameter'

enum Option {
    Alerta = 'Alerta',
    Doloroso = 'Doloroso',
    Verbal = 'Verbal',
    NaoResponsivo = 'Não responsivo'
}

export class Avdn extends Parameter {
    options: string[]

    constructor() {
        super()
        this.title = 'Avdn'
        this.name = 'avdn'
        this.options = Object.values(Option)
    }
}
