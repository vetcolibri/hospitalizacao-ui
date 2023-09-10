<script lang="ts" setup>
import AlertIcon from '@/components/icons/AlertIcon.vue'

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { parameters } from '@/lib/data/parameters'
import type { Alert } from '@/lib/types'

const router = useRouter()
const notShowAgain = ref<boolean>(false)
const dialogAlert = ref<HTMLDialogElement>()
const alertParameters = ref<string[]>()
const data = ref<Alert>()

function add(alert: Alert) {
    data.value = alert
}

function show() {
    dialogAlert.value?.showModal()
}

function close() {
    alertParameters.value = []
    dialogAlert.value?.close()
}

function setParameters() {
    const params = JSON.stringify(parameters)
    localStorage.setItem('parameters', params)
}

function redirectToChooseParameters() {
    router.push({
        name: 'ChooseParameters',
        params: { patientId: data.value?.patientId }
    })
}

function disableAlert() {
    console.log('Alerta destruído')
}

function confirm() {
    setParameters()
    if (notShowAgain.value) {
        disableAlert()
    }
    close()
    redirectToChooseParameters()
}

defineExpose({ show, close, add })
</script>
<template>
    <dialog ref="dialogAlert">
        <div class="w-96 lg:w-1/2 xl:w-1/4 mx-auto border rounded bg-white p-3">
            <h1 class="font-medium text-center uppercase">Alerta</h1>
            <div class="space-y-3 mt-4">
                <div class="flex gap-4 items-center">
                    <p>Parâmetro:</p>
                    <span class="text-sm text-red-500">A cada {{ data?.repeatEvery }}</span>
                </div>
                <ul class="mx-4">
                    <li
                        v-for="parameter in data?.parameters"
                        class="w-full flex items-center gap-2"
                    >
                        <alert-icon class="text-yellow-600" />
                        {{ parameter }}
                    </li>
                </ul>
                <p>{{ data?.comments }}</p>
            </div>
            <div class="mt-4 space-y-2">
                <div class="flex items-center">
                    <input
                        type="checkbox"
                        id="notShowAgain"
                        class="rounded"
                        v-model="notShowAgain"
                    />
                    <label for="notShowAgain" class="block ml-2 text-sm text-gray-900">
                        Não mostrar novamente
                    </label>
                </div>
                <button
                    class="w-full rounded text-white bg-gray-600 hover:bg-gray-800 p-3"
                    @click="confirm()"
                >
                    Confirmar
                </button>
            </div>
        </div>
    </dialog>
</template>
