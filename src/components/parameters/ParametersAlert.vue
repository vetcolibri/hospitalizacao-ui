<script lang="ts" setup>
import BaseDialog from '@/components/BaseDialog.vue'

import { ref, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AlertServiceAPI } from '@/services/alert_service'
import type { Alert } from '@/models/alert'
import { Provided } from '@/lib/provided'

const dialogRef = ref<typeof BaseDialog>()
const props = defineProps<Alert>()
const title = ref<string>('')
const disabledAlert = ref<boolean>(false)
const router = useRouter()
const alertClient = inject<AlertServiceAPI>(Provided.ALERT_SERVICE)!

function convert(seconds: number) {
    if (seconds >= 3600) {
        const hours = Math.floor(seconds / 3600)
        return `${hours} hora${hours > 1 ? 's' : ''}`
    } else if (seconds >= 60) {
        const minutes = Math.floor(seconds / 60)
        return `${minutes} minuto${minutes > 1 ? 's' : ''}`
    } else {
        return `${seconds} segundo${seconds !== 1 ? 's' : ''}`
    }
}

function confirm() {
    dialogRef.value?.close()
}

function open() {
    dialogRef.value?.open()
}

function close() {
    dialogRef.value?.close()
}

defineExpose({ open, close })
onMounted(() => {
    title.value = `Alerta - ${props.patientId}`
})
</script>
<template>
    <BaseDialog ref="dialogRef" :title="title">
        <section class="space-y-4">
            <div class="flex items-center gap-4">
                <p>Parâmetro:</p>
                <span class="text-sm text-red-500">A cada {{ convert(2100) }}</span>
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
