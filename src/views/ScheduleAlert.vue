<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ScheduleTime from '@/components/ScheduleTime.vue'
import ScheduleRate from '@/components/ScheduleRate.vue'

import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'

import { parameters } from '@/lib/data/parameters'
import { timeFromString } from '@/lib/shared/utils'
import { AlertService } from '@/services/alert_service'
import { Provided } from '@/lib/provided'
import type { RepeatEvery } from '@/models/repeat_every'
import { usePatientSelectedStore } from '@/store/patientStore'

const selectedParameters = ref<string[]>([])
const scheduleTime = ref<string>('')
const repeatEvery = ref<RepeatEvery>({ rate: 0, unity: '' })
const comments = ref<string>('')
const textareaElement = ref<HTMLTextAreaElement>()
const scheduleButton = ref<boolean>(false)
const router = useRouter()
const patientStore = usePatientSelectedStore()
const patientId = patientStore.patient
const alertService = inject<AlertService>(Provided.ALERT_SERVICE)!

function wasSelected(name: string) {
    const selected = selectedParameters.value.find((element) => element === name)
    if (selected) return true
    return false
}

function selectParameter(name: string) {
    if (!wasSelected(name)) {
        selectedParameters.value.push(name)
        changeScheduleButton()
        return
    }
    selectedParameters.value = selectedParameters.value.filter((element) => element !== name)
    changeScheduleButton()
    return selectedParameters.value
}

function convertToSeconds() {
    const { rate, unity } = repeatEvery.value
    switch (unity) {
        case 'minutes':
            return rate * 60
        case 'hours':
            return rate * 3600
        default:
            return rate
    }
}

async function schedule() {
    const date = timeFromString(scheduleTime.value)
    const rate = convertToSeconds()
    if (rate < 0) {
        alert('O intervalo de tempo não pode ser negativo')
        return
    }
    const alertData = {
        parameters: selectedParameters.value,
        time: date.toISOString(),
        rate: rate,
        comments: comments.value
    }

    const voidOrError = await alertService.schedule(patientId, alertData)
    if (voidOrError.isLeft()) {
        alert(voidOrError.value.message)
        return
    }

    alert('Alerta agendado com sucesso')
    return router.push({ name: 'Dashboard' })
}

function hasParameterSelected() {
    return selectedParameters.value.length > 0
}

function hasContent() {
    return comments.value.length > 0
}

function changeScheduleButton() {
    if (hasParameterSelected() && hasContent()) {
        return (scheduleButton.value = true)
    }
    return (scheduleButton.value = false)
}
</script>
<template>
    <div>
        <Header title="Alerta na monitorização"></Header>
        <main class="main-content">
            <section class="container my-8">
                <form class="space-y-3">
                    <ScheduleTime v-model="scheduleTime" />
                    <ScheduleRate v-model="repeatEvery" />
                    <div class="overflow-y-auto border rounded space-y-2 p-3">
                        <div
                            v-for="parameter in parameters"
                            class="flex items-center"
                            @click="selectParameter(parameter.name)"
                        >
                            <input
                                type="checkbox"
                                class="rounded focus:ring-0"
                                :name="parameter.name"
                                :checked="wasSelected(parameter.name)"
                            />
                            <label class="ml-2 block text-gray-900">
                                {{ parameter.title }}
                            </label>
                        </div>
                    </div>
                    <textarea
                        ref="textareaElement"
                        name="comments"
                        class="form-control resize-none focus:ring-0 overflow-hidden"
                        placeholder="Observações"
                        rows="4"
                        v-model="comments"
                        @input="changeScheduleButton()"
                    >
                    </textarea>
                </form>
            </section>
        </main>
        <Footer>
            <div class="space-x-3">
                <router-link :to="{ name: 'Dashboard' }">
                    <button class="btn btn-secondary">Cancelar</button>
                </router-link>
                <button v-if="!scheduleButton" class="btn btn-light disabled">
                    <i class="bi bi-clock"></i>
                    Agendar
                </button>
                <button v-if="scheduleButton" class="btn btn-success" @click="schedule()">
                    <i class="bi bi-clock text-white"></i>
                    Agendar
                </button>
            </div>
        </Footer>
    </div>
</template>
