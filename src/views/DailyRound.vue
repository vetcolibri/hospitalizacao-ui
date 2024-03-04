<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import RoundTime from '@/components/RoundTime.vue'
import HeartRate from '@/components/parameters/ParameterHeartRate.vue'
import RespiratoryRate from '@/components/parameters/ParameterRespiratoryRate.vue'
import Trc from '@/components/parameters/ParameterTrc.vue'
import Avdn from '@/components/parameters/ParameterAvdn.vue'
import Mucosas from '@/components/parameters/ParameterMucosas.vue'
import Temperature from '@/components/parameters/ParameterTemperature.vue'
import Glicemia from '@/components/parameters/ParameterGlicemia.vue'
import Hct from '@/components/parameters/ParameterHct.vue'
import Summary from '@/components/parameters/ParametersSummary.vue'
import BloodPressure from '@/components/parameters/ParameterBloodPressure.vue'

import { inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import type { Measurement } from '@/lib/models/measurement'
import { usePatientSelectedStore } from '@/lib/store/patientStore'
import { RoundService } from '@/lib/services/round_service'
import { Provided } from '@/lib/provided'
import { states } from '@/lib/data/parameters_state'
import { getLatestMeasurement } from '@/lib/shared/utils'

const form = ref<HTMLFormElement>()
const parametersState = ref(states)
const alertCheckbox = ref<boolean>(false)
const parametersSummaryRef = ref<typeof Summary>()
const latestMeasurements = ref<Measurement[]>([])
const router = useRouter()
const roundService = inject<RoundService>(Provided.RoundService)!
const patientStore = usePatientSelectedStore()

function records() {
    return Object.values(parametersState.value)
}

function entries() {
    return Object.entries(parametersState.value)
}

function selectAlertCheckbox() {
    alertCheckbox.value = !alertCheckbox.value
}

async function save() {
    const parameters = entries()
        .map(([key, parameter]) => ({ [key]: { value: parameter.value } }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {})

    const voidOrError = await roundService.newRound(patientStore.patient, parameters)
    if (voidOrError.isLeft()) {
        alert('Não foi possível salvar os parâmetros')
        console.error(voidOrError.value)
        return
    }

    alert('Parâmetros salvos com sucesso')

    parametersSummaryRef.value?.close()

    if (alertCheckbox.value) {
        router.push({ name: 'ScheduleAlert' })
        return
    }

    router.push({ name: 'Dashboard' })
}

function confirm() {
    if (!form.value?.checkValidity()) return form.value?.reportValidity()

    const parameters = records()

    parametersSummaryRef.value?.add(parameters)
    parametersSummaryRef.value?.open()
}

onMounted(async () => {
    if (!patientStore.patient) return router.back()

    const measurementsOrError = await roundService.latestMeasurements(patientStore.patient)

    if (measurementsOrError.isLeft()) return

    latestMeasurements.value = measurementsOrError.value
})
</script>
<template>
    <Header title="Ronda diária">
        <GoBack />
    </Header>
    <main class="main-content">
        <section class="container my-8">
            <RoundTime />
            <form ref="form">
                <div class="space-y-4">
                    <HeartRate
                        v-model="parametersState.heartRate.value"
                        :latest-measurement="getLatestMeasurement('heartRate', latestMeasurements)"
                        @state="parametersState.heartRate.state = $event"
                    />
                    <RespiratoryRate
                        v-model="parametersState.respiratoryRate.value"
                        :latest-measurement="
                            getLatestMeasurement('respiratoryRate', latestMeasurements)
                        "
                        @state="parametersState.respiratoryRate.state = $event"
                    />
                    <Trc
                        v-model="parametersState.trc.value"
                        :latest-measurement="getLatestMeasurement('trc', latestMeasurements)"
                        @state="parametersState.trc.state = $event"
                    />
                    <Avdn
                        v-model="parametersState.avdn.value"
                        :latest-measurement="getLatestMeasurement('avdn', latestMeasurements)"
                        @state="parametersState.avdn.state = $event"
                    />
                    <Mucosas
                        v-model="parametersState.mucosas.value"
                        :latest-measurement="getLatestMeasurement('mucosas', latestMeasurements)"
                        @state="parametersState.mucosas.state = $event"
                    />
                    <Temperature
                        v-model="parametersState.temperature.value"
                        :latest-measurement="
                            getLatestMeasurement('temperature', latestMeasurements)
                        "
                        @state="parametersState.temperature.state = $event"
                    />
                    <Glicemia
                        v-model="parametersState.bloodGlucose.value"
                        :latest-measurement="
                            getLatestMeasurement('bloodGlucose', latestMeasurements)
                        "
                        @state="parametersState.bloodGlucose.state = $event"
                    />
                    <Hct
                        v-model="parametersState.hct.value"
                        :latest-measurement="getLatestMeasurement('hct', latestMeasurements)"
                        @state="parametersState.hct.state = $event"
                    />
                    <BloodPressure
                        v-model="parametersState.bloodPressure.value"
                        :latest-measurement="
                            getLatestMeasurement('bloodPressure', latestMeasurements)
                        "
                        @state="parametersState.bloodPressure.state = $event"
                    />
                    <div class="flex items-center">
                        <input
                            type="checkbox"
                            class="focus:ring-0 rounded"
                            v-model="alertCheckbox"
                        />
                        <label class="ml-2 block text-gray-900" @click="selectAlertCheckbox()">
                            Criar alerta de monitorização
                        </label>
                    </div>
                </div>
            </form>
        </section>
    </main>
    <Summary ref="parametersSummaryRef">
        <button class="btn btn-success space-x-3" @click="save()">
            <i class="bi bi-floppy2"></i>
            <span class="font-semibold">Salvar</span>
        </button>
    </Summary>
    <Footer>
        <button type="button" class="btn btn-secondary" @click="confirm">Confirmar</button>
    </Footer>
</template>
