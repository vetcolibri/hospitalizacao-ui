import '@/assets/tailwind.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import { AxiosAdapter } from './lib/adapters/axios_adapter'
import { RoundService } from './services/round_service'
import { AlertService } from './services/alert_service'
import { Provided } from './lib/provided'
import { PatientService } from './services/patient_service'

const pinia = createPinia()
const app = createApp(App)

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const WS_URL = import.meta.env.VITE_WS_URL

const axiosAdapter = new AxiosAdapter()
const patientService = new PatientService(axiosAdapter, SERVER_URL)
const roundService = new RoundService(axiosAdapter, SERVER_URL)
const alertService = new AlertService(axiosAdapter, SERVER_URL)
const webSocket = new WebSocket(`${WS_URL}/alerts/notifications`)

app.provide(Provided.PATIENT_SERVICE, patientService)
app.provide(Provided.ROUND_SERVICE, roundService)
app.provide(Provided.ALERT_SERVICE, alertService)
app.provide(Provided.WEBSOCKET, webSocket)

app.use(router)
app.use(pinia)
app.mount('#app')
