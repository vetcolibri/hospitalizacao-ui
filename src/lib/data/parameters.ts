export const mucosasOptions = ['Cianoticas', 'Congestivas', 'Ictericas', 'Pálidas', 'Rosadas']

export const avdnOptions = ['Alerta', 'Doloroso', 'Verbal', 'Não responsivo']

export const parameters = {
    heartRate: {
        name: 'heartRate',
        title: 'Frequência Cardiaca',
        helpText: '(70 - 120) BPM',
        measurement: { value: '', message: '' },
        required: true,
        chooseVisibility: false
    },
    respiratoryRate: {
        name: 'respiratoryRate',
        title: 'Frequência Respiratória',
        helpText: '(10 - 30) RPM',
        measurement: { value: '', message: '' },
        required: true,
        chooseVisibility: false
    },
    trc: {
        name: 'trc',
        title: 'TRC',
        helpText: "(> 2')",
        measurement: { value: '', message: '' },
        required: true,
        chooseVisibility: false
    },
    avdn: {
        name: 'avdn',
        title: 'AVDN',
        measurement: { value: '', message: '' },
        required: true,
        options: avdnOptions,
        chooseVisibility: false
    },
    mucosas: {
        name: 'mucosas',
        title: 'Mucosas',
        measurement: { value: '', message: '' },
        required: true,
        options: mucosasOptions,
        chooseVisibility: false
    },
    temperature: {
        title: 'Temperatura',
        name: 'temperature',
        helpText: '(37.5 - 39) ºC',
        measurement: { value: '', message: '' },
        required: true,
        chooseVisibility: false
    },
    glicemia: {
        title: 'Glicemia',
        name: 'glicemia',
        helpText: '(60 - 100) mg/dl',
        measurement: { value: '', message: '' },
        required: true,
        chooseVisibility: false
    },
    hct: {
        title: 'HCT',
        name: 'hct',
        helpText: 'Canino (37 - 55)% e Felino (24 - 45)%',
        measurement: { value: '', message: '' },
        required: true,
        chooseVisibility: false
    },
    bloodPressure: {
        name: 'bloodPressure',
        title: 'Pressão Arterial - Sis/Dis (PAM)',
        type: 'text',
        helpText: '(11/70 - 12/80) mm/Hg - (60)',
        measurement: { value: '', message: '' },
        required: true,
        chooseVisibility: false
    }
}
