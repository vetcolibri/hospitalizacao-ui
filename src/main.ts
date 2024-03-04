import '@/assets/tailwind.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import { AxiosAdapter } from './lib/adapters/axios_adapter'
import { Provided } from './lib/provided'
import { AlertService } from './lib/services/alert_service'
import { PatientService } from './lib/services/patient_service'
import { RoundService } from './lib/services/round_service'

const pinia = createPinia()
const app = createApp(App)

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const WS_URL = import.meta.env.VITE_WS_URL

const axiosAdapter = new AxiosAdapter()
const patientService = new PatientService(axiosAdapter, SERVER_URL)
const roundService = new RoundService(axiosAdapter, SERVER_URL)
const alertService = new AlertService(axiosAdapter, SERVER_URL)
const webSocket = new WebSocket(`${WS_URL}/alerts/notifications`)

app.provide(Provided.PatientService, patientService)
app.provide(Provided.RoundService, roundService)
app.provide(Provided.AlertService, alertService)
app.provide(Provided.Websocket, webSocket)

app.use(router)
app.use(pinia)
app.mount('#app')
