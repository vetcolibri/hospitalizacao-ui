export const mucosasOptions = ["3", "5"]

export const avdnOptions = ["3", "5"]

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
        required: true},
    {
        title: "Pressão Arterial", 
        helpText: "(11/70 - 12/80) mm/Hg", 
        name: "bloodPressure",
        value: "", 
        isCombox: false,
        required: true},
    {
        title: "PAM", 
        helpText: "(60)" , 
        name: "pam",
        value: "",
        isCombox: false,
        required: true
    },
]
