import { Parameter } from './parameter'

enum Option {
    Alerta = 'Alerta',
    Doloroso = 'Doloroso',
    Verbal = 'Verbal',
    NaoResponsivo = 'Não responsivo'
}

enum Color {
    Green = 'badge-success',
    Yellow = 'badge-warning',
    Red = 'badge-danger'
}

export class Avdn extends Parameter {
    options: string[]
    colors: Record<string, string> = {}

    constructor() {
        super()
        this.title = 'AVDN'
        this.name = 'avdn'
        this.options = Object.values(Option)

        this.buildColors()
    }

    private buildColors() {
        this.options.map((option, idx) => {
            this.colors[option] = Object.values(Color)[idx]

            if (idx === 1 || idx === 2) {
                this.colors[option] = Object.values(Color)[1]
            }

            if (idx === 3) {
                this.colors[option] = Object.values(Color)[2]
            }
        })
    }
}
