<script setup lang="ts">
import ParametersAlert from './components/parameters/ParametersAlert.vue'

import { inject, ref } from 'vue'
import { Provided } from './lib/provided'

const parametersAlertRef = ref<typeof ParametersAlert>()
const alertId = ref<string>('')
const patientId = ref<string>('')
const parameters = ref<string[]>([])
const repeatEvery = ref<number>(0)
const comments = ref<string>('')
const webSocket = inject<WebSocket>(Provided.WEBSOCKET)!

webSocket.onopen = () => {
    console.log('Websocket Connected.')
}

webSocket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    patientId.value = data.patient.patientId
    alertId.value = data.alertId
    parameters.value = data.parameters
    repeatEvery.value = data.repeatEvery
    comments.value = data.comments
    parametersAlertRef.value?.open()
}
</script>
<template>
    <div class="bg-gray-300 relative">
        <router-view />
        <ParametersAlert
            ref="parametersAlertRef"
            alert-id="120"
            comments="Atenção a glicemia do paciente"
            patient-id="1"
            :repeat-every="120"
            :parameters="['AVDN', 'Glicemia']"
        />
    </div>
</template>
