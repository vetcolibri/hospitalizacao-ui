export const mucosasOptions = [
    "Cianoticas", 
    "Congestivas",
    "Ictericas",
    "Pálidas",
    "Rosadas"
]

export const avdnOptions = [
    "Alerta", 
    "Doloroso",
    "Verbal",
    "Não responsivo"
]

export const parameters = {
    heartRate: {
        name: "heartRate",
        title: "Frequência Cardiaca", 
        helpText: "(70 - 120) BPM" , 
        value: "",
        required: true,
        chooseVisibility: false
    },
    respiratoryRate: {
        name: "respiratoryRate",
        title: "Frequencia Respiratoria", 
        helpText: "(10 - 30) RPM" , 
        value: "", 
        required: true,
        chooseVisibility: false
    },
    trc: {
        name: "trc",
        title: "TRC", 
        helpText: "(> 2')", 
        value: "", 
        required: true,
        chooseVisibility: false
    },
    avdn: {
        name: "avdn",
        title: "AVDN", 
        value: "",
        required: true,
        options: avdnOptions,
        chooseVisibility: false
    },
    mucosas: {
        name: "mucosas",
        title: "Mucosas", 
        value: "", 
        required: true,
        options: mucosasOptions,
        chooseVisibility: false
    },
    temperature: {
        title: "Temperatura", 
        name: "temperature",
        helpText: "(37.5 - 39) ºC" , 
        value: "", 
        required: true,
        chooseVisibility: false
    },
    glicemia: {
        title: "Glicemia", 
        name: "glicemia",
        helpText: "(60 - 100) mg/dl" , 
        value: "", 
        required: true,
        chooseVisibility: false
    },
    hct: {
        title: "HCT", 
        name: "htc",
        helpText: "Canino (37 - 55)% e Felino (24 - 45)%" , 
        value: "",
        required: true,
        chooseVisibility: false
    },
    bloodPressure: {
        name: "bloodPressure",
        title: "Pressão Arterial - Sis/Dis (PAM)", 
        type: "text",
        helpText: "(11/70 - 12/80) mm/Hg - (60)",
        value: "", 
        required: true,
        chooseVisibility: false
    }
}
