<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import ExamTime from '@/components/ExamTime.vue'
import HeartRate from '@/components/ParameterHeartRate.vue'
import RespiratoryRate from '@/components/ParameterRespiratoryRate.vue'
import TRC from '@/components/ParameterTRC.vue'
import AVDN from '@/components/ParameterAVDN.vue'
import Mucosas from '@/components/ParameterMucosas.vue'
import Temperature from '@/components/ParameterTemperature.vue'
import Glicemia from '@/components/ParameterGlicemia.vue'
import HCT from '@/components/ParameterHCT.vue'
import BloodPressure from '@/components/ParameterBloodPressure.vue'
import Summary from '@/components/ParametersSummary.vue'

import { inject, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { parameters } from '@/lib/data/parameters'
import type { Measurement } from '@/lib/types'
import { getAllMeasurements, openSummary, lastMeasurement } from '@/lib/shared/utils'
import { MeasurementAPI } from '@/lib/apiClient/measurements'

const dailyRound = ref(parameters)
const alertCheckbox = ref<boolean>(false)
const summaryOfMeasurements = ref<typeof Summary>()
const form = ref<HTMLFormElement>()
const latestMeasurements = ref<Measurement[]>([])

const route = useRoute()
const router = useRouter()
const patientId = `${route.params.patientId}`
const measurmentClient = inject('measurementClient') as MeasurementAPI

function confirm() {
    const parameters = dailyRound.value
    const measurements = getAllMeasurements(parameters)
    measurmentClient.newMeasurements(patientId, measurements)
    summaryOfMeasurements.value?.close()
    if (alertCheckbox.value) {
        return router.push({ name: 'ScheduleAlert', params: { patientId } })
    }
    return router.push({ name: 'ExamGeneralCondition' })
}

onBeforeMount(async () => {
    latestMeasurements.value = await measurmentClient.latestMeasurements(patientId)
})
</script>
<template>
    <Header title="Ronda diária">
        <GoBack />
    </Header>
    <main class="main-content py-8">
        <section class="parameters-container">
            <ExamTime />
            <form ref="form" class="grid grid-row-1 space-y-4">
                <HeartRate
                    :name="parameters.heartRate.name"
                    :title="parameters.heartRate.title"
                    :helpText="parameters.heartRate.helpText"
                    v-model="parameters.heartRate.measurement"
                    :last-measurement="
                        lastMeasurement(parameters.heartRate.name, latestMeasurements)
                    "
                />
                <RespiratoryRate
                    :name="parameters.respiratoryRate.name"
                    :title="parameters.respiratoryRate.title"
                    :helpText="parameters.respiratoryRate.helpText"
                    v-model="parameters.respiratoryRate.measurement"
                    :last-measurement="
                        lastMeasurement(parameters.respiratoryRate.name, latestMeasurements)
                    "
                />
                <TRC
                    :name="parameters.trc.name"
                    :title="parameters.trc.title"
                    :helpText="parameters.trc.helpText"
                    v-model="parameters.trc.measurement"
                    :last-measurement="lastMeasurement(parameters.trc.name, latestMeasurements)"
                />
                <AVDN
                    :name="parameters.avdn.name"
                    :title="parameters.avdn.title"
                    :options="parameters.avdn.options"
                    v-model="parameters.avdn.measurement"
                    :last-measurement="lastMeasurement(parameters.avdn.name, latestMeasurements)"
                />
                <Mucosas
                    :name="parameters.mucosas.name"
                    :title="parameters.mucosas.title"
                    :options="parameters.mucosas.options"
                    v-model="parameters.mucosas.measurement"
                    :last-measurement="lastMeasurement(parameters.mucosas.name, latestMeasurements)"
                />

                <Temperature
                    :name="parameters.temperature.name"
                    :title="parameters.temperature.title"
                    :helpText="parameters.temperature.helpText"
                    v-model="parameters.temperature.measurement"
                    :last-measurement="
                        lastMeasurement(parameters.temperature.name, latestMeasurements)
                    "
                />
                <Glicemia
                    :name="parameters.glicemia.name"
                    :title="parameters.glicemia.title"
                    :helpText="parameters.glicemia.helpText"
                    v-model="parameters.glicemia.measurement"
                    :last-measurement="
                        lastMeasurement(parameters.glicemia.name, latestMeasurements)
                    "
                />
                <HCT
                    :name="parameters.hct.name"
                    :title="parameters.hct.title"
                    :helpText="parameters.hct.helpText"
                    v-model="parameters.hct.measurement"
                    :last-measurement="lastMeasurement(parameters.hct.name, latestMeasurements)"
                />
                <BloodPressure
                    :name="parameters.bloodPressure.name"
                    :title="parameters.bloodPressure.title"
                    :type="parameters.bloodPressure.type"
                    :helpText="parameters.bloodPressure.helpText"
                    v-model="parameters.bloodPressure.measurement"
                    :last-measurement="
                        lastMeasurement(parameters.bloodPressure.name, latestMeasurements)
                    "
                />
                <div class="flex items-center">
                    <input type="checkbox" class="focus:ring-0 rounded" v-model="alertCheckbox" />
                    <label
                        class="ml-2 block text-gray-900"
                        @click="() => (alertCheckbox = !alertCheckbox)"
                    >
                        Criar alerta de monitorização
                    </label>
                </div>
            </form>
        </section>
    </main>
    <Footer>
        <button
            type="button"
            class="btn-success"
            @click="openSummary(form!, summaryOfMeasurements, Object.values(dailyRound))"
        >
            Salvar
        </button>
    </Footer>
    <Summary ref="summaryOfMeasurements" title="Detalhes">
        <button type="button" class="btn-secondary" @click="confirm()">Confirmar</button>
    </Summary>
</template>
