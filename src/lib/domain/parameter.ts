export class Parameter {
    name: string
    title: string
    helpText: string
    value: string
    required: boolean
    visibility: boolean
    status: string
    issuedAt?: string
    max?: number
    min?: number

    constructor() {
        this.name = ''
        this.helpText = ''
        this.value = ''
        this.title = ''
        this.status = ''
        this.required = true
        this.visibility = false
    }

    toggleRequired() {
        this.value = ''
        this.required = !this.required
    }

    toggleVisibility() {
        this.visibility = !this.visibility
    }

    verifyStatus() {
        return this.status
    }

    setValue(value: string) {
        this.value = value
    }

    setIssuedAt(value?: string) {
        this.issuedAt = value
    }

    get numberValue() {
        return Number(this.value)
    }
}
