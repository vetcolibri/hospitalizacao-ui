<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AlertIcon from '@/components/icons/AlertIcon.vue'
import { Alert, Parameter } from '@/lib/types'

const router = useRouter()
const notShowAgain = ref<boolean>(false)
const isVisibleAlert = ref(true)
const parameters = ref<Parameter[]>()
const props = defineProps<Alert>()

function closeAlert() {
    isVisibleAlert.value = false
}

function setParameters() {
    const params = JSON.stringify(parameters)
    localStorage.setItem('parameters', params)
}

function redirectToChooseParameters() {
    router.push({
        name: 'ChooseParameters',
        params: { patientId: props.patientId }
    })
}

function destroyAlert() {
    console.log('Alerta destruído')
}

function confirm() {
    setParameters()
    closeAlert()
    if (notShowAgain.value) {
        destroyAlert()
    }
    redirectToChooseParameters()
}
</script>
<template>
    <dialog
        v-show="isVisibleAlert"
        class="flex items-center absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50"
    >
        <div class="w-96 lg:w-1/2 xl:w-1/4 mx-auto border rounded bg-white p-3">
            <h1 class="font-medium text-center uppercase">Alerta</h1>
            <div class="space-y-3 mt-4">
                <div class="flex gap-4 items-center">
                    <p>Parâmetro:</p>
                    <span class="text-sm text-red-500">A cada {{ repeatEvery }}</span>
                </div>
                <ul class="mx-4">
                    <li v-for="parameter in parameters" class="w-full flex items-center gap-2">
                        <alert-icon class="text-yellow-600" />
                        {{ parameter.title }}
                    </li>
                </ul>
                <p>{{ comments }}</p>
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
                    @click="confirm"
                >
                    Confirmar
                </button>
            </div>
        </div>
    </dialog>
</template>
