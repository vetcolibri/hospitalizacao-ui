<script lang="ts" setup>
import BaseDialog from '@/components/BaseDialog.vue'

import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'

import { useParametersStore } from '@/store/parametersStore'
import { AlertServiceAPI } from '@/services/alert_service'
import { Provided } from '@/lib/provided'

const dialogRef = ref<typeof BaseDialog>()
const title = ref<string>('')
const patient = ref({ patientId: '', name: '' })
const alertId = ref<string>('')
const parameters = ref<string[]>([])
const comments = ref<string>('')
const repeatEvery = ref<number>()
const disabledAlert = ref<boolean>(false)
const router = useRouter()
const alertService = <AlertServiceAPI>inject(Provided.ALERT_SERVICE)!
const webSocket = <WebSocket>inject(Provided.WEBSOCKET)
const parametersStore = useParametersStore()

webSocket.onopen = () => {
    console.log('Websocket Connected.')
}

webSocket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    patient.value = { patientId: data.patient.patientId, name: data.patient.name }
    alertId.value = data.alertId
    parameters.value = data.parameters
    comments.value = data.comments
    repeatEvery.value = data.repeatEvery
    title.value = `Alerta - ${patient.value.patientId} - ${patient.value.name}`
    open()
}

function convert() {
    if (repeatEvery.value! >= 3600) {
        const hours = Math.floor(repeatEvery.value! / 3600)
        return `${hours} hora${hours > 1 ? 's' : ''}`
    } else if (repeatEvery.value! >= 60) {
        const minutes = Math.floor(repeatEvery.value! / 60)
        return `${minutes} minuto${minutes > 1 ? 's' : ''}`
    } else {
        return `${repeatEvery.value!} segundo${repeatEvery.value! !== 1 ? 's' : ''}`
    }
}

async function confirm() {
    if (disabledAlert.value) {
        const voidOrError = await alertService.disableAlert(alertId.value)
        if (voidOrError.isLeft()) {
            alert(voidOrError.value.message)
            return
        }
        alert('Alerta foi cancelado com sucesso.')
    }

    parametersStore.$patch({ parameters: parameters.value })
    dialogRef.value?.close()
    router.push({ name: 'ChooseParameters', params: { patientId: patient.value.patientId } })
}

function open() {
    dialogRef.value?.open()
}

function close() {
    dialogRef.value?.close()
}

defineExpose({ open, close })
</script>
<template>
    <BaseDialog ref="dialogRef" :title="title">
        <section class="space-y-4">
            <div class="flex items-center gap-4">
                <p>Parâmetro:</p>
                <span class="text-sm text-red-500">A cada {{ convert() }}</span>
            </div>
            <ul class="space-y-1">
                <li v-for="name in parameters" class="w-full flex items-center gap-4">
                    <i class="bi bi-exclamation-triangle-fill text-yellow-600 md:text-lg"></i>
                    <span>{{ name }}</span>
                </li>
            </ul>
            <p class="text-sm md:text-base text-justify text-gray-500">{{ comments }}</p>
            <p class="flex items-center" @click="() => (disabledAlert = !disabledAlert)">
                <input type="checkbox" class="rounded focus:ring-0" v-model="disabledAlert" />
                <label for="notShowAgain" class="block ml-2 text-sm text-gray-900">
                    Não mostrar novamente
                </label>
            </p>
        </section>
        <button class="btn-success w-full mt-8" @click="confirm()">Confirmar</button>
    </BaseDialog>
</template>
