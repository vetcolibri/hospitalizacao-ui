export const PARAMETERS = [
    { name: 'heartRate', title: 'Frequência cardíaca' },
    { name: 'respiratoryRate', title: 'Frequência respiratória' },
    { name: 'trc', title: 'Trc' },
    { name: 'avdn', title: 'Avdn' },
    { name: 'mucosas', title: 'Mucosas' },
    { name: 'temperature', title: 'Temperatura' },
    { name: 'bloodGlucose', title: 'Glicemia' },
    { name: 'hct', title: 'Hct' },
    { name: 'bloodPressure', title: 'Pressão arterial' }
]

export function parameterTitle(name: string) {
    const parameter = PARAMETERS.find((p) => p.name === name)

    if (!parameter) return ''

    return parameter.title
}
