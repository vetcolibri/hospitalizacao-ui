export class Parameter {
    name: string
    helpText: string
    value: string
    required: boolean
    visibility: boolean

    constructor() {
        this.name = ''
        this.helpText = ''
        this.value = ''
        this.required = true
        this.visibility = true
    }

    toogleEnable() {
        this.value = ''
        this.required = !this.required
    }

    toogleVisibility() {
        this.visibility = !this.visibility
    }
}
