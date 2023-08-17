const iconUrl = "https://cdn4.iconfinder.com/data/icons/social-messaging-productivity-black-4/1/101_13-512.png"

const PATIENTS = [
    {
        id: "001001:maximus:joao-santos",
        name: "Maximus",
        specie: "Bulldog",
        exams: [],
        alerts: [],
        iconUrl
    },
    {
        id: "codigo:nome-do-animal:nome-do-tutor",
        name: "Rex",
        specie: "Bulldog",
        exams: [
            {
                heartRate: "4",
                respiratoryRate: "2",
                trc: "3",
                mucosas: "4",
                avdn: "3",
                temperature: "3",
                glicemia: "2",
                bloodPressure: "2",
                pam: "1"
            }
        ],
        alerts: [
            {
                hour: "10h00", 
                rate: 1800, 
                parameters: ["Temperatura"],
                comments: "Atenção a temperatura do paciente.",
                status: true
            }
        ],
        iconUrl
    },
    {
        id: "codigo:nome-do-animal:nome-do-tutor",
        name: "Rex",
        specie: "Bulldog",
        exams: [],
        alerts: [],
        iconUrl,
    },
    {
        id: "codigo:nome-do-animal:nome-do-tutor",
        name: "Rex",
        specie: "Bulldog",
        exams: [],
        alerts: [],
        iconUrl
    }
]

export default PATIENTS
