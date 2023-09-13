export function openSummary(form: HTMLFormElement, summary: any, parameters: any) {
    if (!form.checkValidity()) {
        return form.reportValidity()
    }
    if (parameters.length > 0) {
        summary.addParameters(parameters)
        summary.show()
    }
}

export function lastMeasurement(parameter: string, measurements: any) {
    const measurement = measurements.find((m: any) => m.parameter === parameter)
    if (measurement) return measurement
}
