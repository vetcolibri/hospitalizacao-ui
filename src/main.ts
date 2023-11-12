import '@/assets/tailwind.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import { AxiosAdapter } from './lib/adapters/axios_adapter'
import { MeasurementServiceAPI } from './services/measurement_service'
import { AlertServiceAPI } from './services/alert_service'
import { Provided } from './lib/provided'
import { PatientServiceAPI } from './services/patient_service'

const pinia = createPinia()
const app = createApp(App)

const baseUrl = 'http://localhost:8000'
const axiosAdapter = new AxiosAdapter()
const patientService = new PatientServiceAPI(axiosAdapter, baseUrl)
const measurementService = new MeasurementServiceAPI(axiosAdapter, baseUrl)
const alertService = new AlertServiceAPI(axiosAdapter, baseUrl)
const webSocket = new WebSocket('ws://localhost:8000/alerts/notifications')

app.provide(Provided.PATIENT_SERVICE, patientService)
app.provide(Provided.MEASUREMENT_SERVICE, measurementService)
app.provide(Provided.ALERT_SERVICE, alertService)
app.provide(Provided.WEBSOCKET, webSocket)

app.use(router)
app.use(pinia)
app.mount('#app')
