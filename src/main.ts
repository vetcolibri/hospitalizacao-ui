import "@/assets/tailwind.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { AxiosAdapter } from "./lib/apiClient/adapters";
import { PatientAPI } from "./lib/apiClient/patients";
import { MeasurementAPI } from "./lib/apiClient/measurements";
import { AlertAPI } from "./lib/apiClient/alerts";
import { Provided } from "./lib/provided";
import { HttpPatientService } from "./services/patient_service";

const app = createApp(App);

const baseUrl = "http://192.168.10.69:8000";
const axiosAdapter = new AxiosAdapter();
const patientService = new HttpPatientService(axiosAdapter, baseUrl);
const measurementClient = new MeasurementAPI(axiosAdapter, baseUrl);
const alertClient = new AlertAPI(axiosAdapter, baseUrl);
const webSocket = new WebSocket("ws://192.168.10.69:8000/alerts/notifications");

app.provide(Provided.PatientService, patientService);
app.provide("measurementClient", measurementClient);
app.provide("alertClient", alertClient);
app.provide("webSocket", webSocket);

app.use(router);

app.mount("#app");
