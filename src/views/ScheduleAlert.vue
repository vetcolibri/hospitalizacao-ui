<script setup lang="ts">
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'
import ScheduleRate from '@/components/ScheduleRate.vue'
import ScheduleTime from '@/components/ScheduleTime.vue'

import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'

import type { RepeatEvery } from '@/lib/models/repeat_every'
import { Provided } from '@/lib/provided'
import { AlertServiceImpl } from '@/lib/services/alert_service'
import { convertInSeconds } from '@/lib/shared/convert_in_seconds'
import { timeFromString } from '@/lib/shared/format_time'
import { useCurrentPatient } from '@/lib/store/patientStore'
import { PARAMETERS } from '@/lib/shared/parameters'

const selectedParameters = ref<string[]>([])
const scheduleTime = ref<string>('')
const repeatEvery = ref<RepeatEvery>({ rate: 30, unit: 'minutes' })
const comments = ref<string>('')
const textareaElement = ref<HTMLTextAreaElement>()
const scheduleButton = ref<boolean>(false)
const router = useRouter()
const patientStore = useCurrentPatient()
const alertService = inject<AlertServiceImpl>(Provided.AlertService)!

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

async function schedule() {
    const { rate, unit } = repeatEvery.value
    const date = timeFromString(scheduleTime.value)
    if (convertInSeconds(rate, unit) < 0) {
        alert('O intervalo de tempo não pode ser negativo')
        return
    }

    const voidOrErr = await alertService.schedule({
        patientId: patientStore.patient.patientId,
        parameters: selectedParameters.value,
        time: date.toISOString(),
        rate: convertInSeconds(rate, unit),
        comments: comments.value
    })

    if (voidOrErr.isLeft()) {
        alert(voidOrErr.value.message)
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
        <Header title="Alerta na monitorização" />
        <main class="main-content">
            <section class="container my-8">
                <form class="space-y-3">
                    <ScheduleTime @update:model-value="scheduleTime = $event" />
                    <ScheduleRate
                        @rate="repeatEvery.rate = $event"
                        @unit="repeatEvery.unit = $event"
                    />

                    <div class="overflow-y-auto border rounded space-y-2 p-3">
                        <div
                            v-for="parameter in PARAMETERS"
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
