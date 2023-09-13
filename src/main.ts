import '@/assets/tailwind.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { AxiosAdapter } from './lib/apiClient/adapters'
import { PatientAPI } from './lib/apiClient/patients'

const app = createApp(App)

const baseUrl = "http://localhost:8000"
const axiosAdapter = new AxiosAdapter()
const patientClient = new PatientAPI(axiosAdapter, baseUrl)
app.provide("patientClient", patientClient)

app.use(router)

app.mount('#app')
