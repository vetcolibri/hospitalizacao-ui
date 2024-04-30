<script lang="ts" setup>
import BaseDialog from '@/components/BaseDialog.vue'

import { ref, inject, reactive } from 'vue'
import { useRouter } from 'vue-router'

import { useParametersStore } from '@/lib/store/parametersStore'
import { AlertServiceImpl } from '@/lib/services/alert_service'
import { Provided } from '@/lib/provided'
import { useCurrentPatient } from '@/lib/store/patientStore'
import { convert } from '@/lib/shared/convert_seconds'
import { useAuth } from '@/composables/useAuth'
import { parameterTitle } from '@/lib/shared/parameters'

const alertPayload = reactive({
    alertId: '',
    parameters: [],
    comments: '',
    repeatEvery: 0,
    patient: {
        patientId: '',
        name: ''
    }
})

const dialogRef = ref<typeof BaseDialog>()
const disabledAlert = ref<boolean>(false)
const title = ref<string>('')
const router = useRouter()
const alertService = <AlertServiceImpl>inject(Provided.AlertService)!
const webSocket = <WebSocket>inject(Provided.Websocket)
const parametersStore = useParametersStore()
const patientStore = useCurrentPatient()
const auth = useAuth()

webSocket.onopen = () => {
    console.log('Websocket Connected.')
}

webSocket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    title.value = `Alerta - ${data.patient.name}`
    makeAlertPayload(data)
    open()
}

function makeAlertPayload(data: any) {
    alertPayload.alertId = data.alertId
    alertPayload.parameters = data.parameters
    alertPayload.comments = data.comments
    alertPayload.repeatEvery = data.repeatEvery
    alertPayload.patient = data.patient
}

async function confirm() {
    if (disabledAlert.value) {
        const voidOrError = await alertService.cancel(alertPayload.alertId)
        if (voidOrError.isLeft()) {
            alert(voidOrError.value.message)
            return
        }
        alert('Alerta foi cancelado com sucesso.')
    }

    parametersStore.$patch({ parameters: alertPayload.parameters })
    patientStore.$patch({ patientId: alertPayload.patient.patientId })
    dialogRef.value?.close()
    router.push({ name: 'ChooseParameters' })
}

function open() {
    if (!auth.isAuthenticated()) return
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
                <span class="text-red-500">A cada {{ convert(alertPayload.repeatEvery) }}</span>
            </div>
            <ul class="space-y-1">
                <li v-for="name in alertPayload.parameters" class="w-full flex items-center gap-4">
                    <i class="bi bi-exclamation-triangle-fill text-yellow-600 md:text-lg"></i>
                    <span class="text-red-500 underline">
                        {{ parameterTitle(name) }}
                    </span>
                </li>
            </ul>
            <p class="text-justify text-gray-500">{{ alertPayload.comments }}</p>
            <p class="flex items-center" @click="disabledAlert = !disabledAlert">
                <input type="checkbox" class="rounded focus:ring-0" v-model="disabledAlert" />
                <label for="notShowAgain" class="block ml-2 text-gray-900">
                    Não mostrar novamente
                </label>
            </p>
        </section>
        <button class="w-full mt-8 btn btn-success" @click="confirm()">
            <i class="bi bi-check2"></i>
            Confirmar
        </button>
    </BaseDialog>
</template>
