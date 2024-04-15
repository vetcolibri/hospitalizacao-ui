import { Parameter } from './parameter'

enum Option {
    Cianoticas = 'Cianoticas',
    Congestivas = 'Congestivas',
    Ictericas = 'Ictericas',
    Palidas = 'Pálidas',
    Rosadas = 'Rosadas'
}

enum Color {
    Yellow = 'yellow',
    Red = 'red',
    Green = 'green',
    Blue = 'blue',
    Pink = 'pink'
}

export class Mucosas extends Parameter {
    options: string[]
    colors: Record<string, string> = {}

    constructor() {
        super()
        this.title = 'Mucosas'
        this.name = 'mucosas'
        this.options = Object.values(Option)
        this.buildColors()
    }

    private buildColors() {
        this.options.map((option, idx) => {
            this.colors[option] = Object.values(Color)[idx]
        })
    }
}
