const iconUrl = "https://cdn4.iconfinder.com/data/icons/social-messaging-productivity-black-4/1/101_13-512.png"

const PATIENTS = [
    {
        id: "codigo:nome:tutor",
        name: "Maximus",
        specie: "Bulldog",
        exams: [],
        alerts: [],
        iconUrl
    },
    {
        id: "codigo:nome:tutor",
        name: "Rex",
        specie: "Bulldog",
        exams: [
            {id: 1, parameter: "", value: 2},
            {id: 1, parameter: "", value: 2},
            {id: 1, parameter: "", value: 2}
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
        id: "codigo:nome:tutor",
        name: "Rex",
        specie: "Bulldog",
        exams: [],
        alerts: [],
        iconUrl,
    },
    {
        id: "codigo:nome:tutor",
        name: "Rex",
        specie: "Bulldog",
        exams: [],
        alerts: [],
        iconUrl
    }
]

export default PATIENTS
