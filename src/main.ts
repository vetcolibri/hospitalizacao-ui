import "@/assets/tailwind.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { AxiosAdapter } from "./lib/apiClient/adapters";
import { PatientAPI } from "./lib/apiClient/patients";
import { MeasurementAPI } from "./lib/apiClient/measurements";
import { AlertAPI } from "./lib/apiClient/alerts";

const app = createApp(App);

const baseUrl = "http://localhost:8000";
const axiosAdapter = new AxiosAdapter();
const patientClient = new PatientAPI(axiosAdapter, baseUrl);
const measurementClient = new MeasurementAPI(axiosAdapter, baseUrl);
const alertClient = new AlertAPI(axiosAdapter, baseUrl);
const webSocket = new WebSocket("ws://localhost:8000/alerts/notifications");

app.provide("patientClient", patientClient);
app.provide("measurementClient", measurementClient);
app.provide("alertClient", alertClient);
app.provide("webSocket", webSocket);

app.use(router);

app.mount("#app");
