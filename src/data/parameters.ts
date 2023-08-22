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

export const parameters = [
    {
        title: "Frequência Cardiaca", 
        helpText: "(70 - 120) BPM" , 
        name: "heartRate",
        value: "",
        isCombox: false,
        required: true
    },
    {
        title: "Frequencia Respiratoria", 
        helpText: "(10 - 30) RPM" , 
        name: "respiratoryRate",
        value: "", 
        isCombox: false,
        required: true
    },
    {
        title: "TRC", 
        helpText: "(> 2')", 
        name: "trc",
        value: "", 
        isCombox: false,
        required: true
    },
    {
        title: "Mucosas", 
        helpText: "", 
        name: "mucosas",
        value: "", 
        isCombox: true,
        required: true,
        options: mucosasOptions,
    },
    {
        title: "AVDN", 
        helpText: "", 
        name: "avdn",
        value: "",
        isCombox: true,
        required: true,
        options: avdnOptions
    },
    {
        title: "Temperatura", 
        helpText: "(37.5 - 39) ºC" , 
        name: "temperature",
        value: "", 
        isCombox: false,
        required: true
    },
    {
        title: "Glicemia", 
        helpText: "(60 - 100) mg/dl" , 
        name: "glicemia",
        value: "", 
        isCombox: false,
        required: true
    },
    {
        title: "HCT", 
        helpText: "Canino (37 - 55)% e Felino (24 - 45)%" , 
        name: "htc",
        value: "",
        isCombox: false,
        required: true
    },
    {
        title: "Pressão Arterial (Sis/Dis - PAM)", 
        helpText: "(11/70 - 12/80) mm/Hg - (60)", 
        name: "bloodPressure",
        value: "", 
        isCombox: false,
        required: true
    }
]
