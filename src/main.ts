import '@/assets/tailwind.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { AxiosAdapter } from './lib/adapters/axios_adapter'
import { HttpMeasurementService } from './services/measurement_service'
import { HttpAlertService } from './services/alert_service'
import { Provided } from './lib/provided'
import { FakePatientService, HttpPatientService } from './services/patient_service'

const app = createApp(App)

const baseUrl = 'http://192.168.10.69:8000'
const axiosAdapter = new AxiosAdapter()
const patientService = new FakePatientService()
const measurementService = new HttpMeasurementService(axiosAdapter, baseUrl)
const alertService = new HttpAlertService(axiosAdapter, baseUrl)
const webSocket = new WebSocket('ws://192.168.10.69:8000/alerts/notifications')

app.provide(Provided.PATIENT_SERVICE, patientService)
app.provide(Provided.MEASUREMENT_SERVICE, measurementService)
app.provide(Provided.ALERT_SERVICE, alertService)
app.provide(Provided.WEBSOCKET, webSocket)

app.use(router)

app.mount('#app')
