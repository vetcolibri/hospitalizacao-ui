import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@/assets/tailwind.css'

import { AxiosAdapter } from './lib/adapters/axios_adapter'
import { Provided } from './lib/provided'
import { AlertServiceImpl } from './lib/services/alert_service'
import { BudgetServiceImpl } from './lib/services/budget_service'
import { CrmServiceImpl } from './lib/services/crm_service'
import { HospitalizationServiceImpl } from './lib/services/hospitalization_service'
import { PatientServiceImpl } from './lib/services/patient_service'
import { RoundServiceImpl } from './lib/services/round_service'

const pinia = createPinia()
const app = createApp(App)

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const WS_URL = import.meta.env.VITE_WS_URL

const axiosAdapter = new AxiosAdapter()
const patientService = new PatientServiceImpl(axiosAdapter, SERVER_URL)
const roundService = new RoundServiceImpl(axiosAdapter, SERVER_URL)
const alertService = new AlertServiceImpl(axiosAdapter, SERVER_URL)
const ownerService = new CrmServiceImpl(axiosAdapter, SERVER_URL)
const hospitalizationService = new HospitalizationServiceImpl(axiosAdapter, SERVER_URL)
const budgetService = new BudgetServiceImpl(axiosAdapter, SERVER_URL)
const webSocket = new WebSocket(`${WS_URL}/alerts/notifications`)

app.provide(Provided.PatientService, patientService)
app.provide(Provided.RoundService, roundService)
app.provide(Provided.AlertService, alertService)
app.provide(Provided.Websocket, webSocket)
app.provide(Provided.CrmService, ownerService)
app.provide(Provided.HospitalizationService, hospitalizationService)
app.provide(Provided.BudgetService, budgetService)

app.use(router)
app.use(pinia)

app.mount('#app')
