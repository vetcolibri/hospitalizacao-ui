<script setup lang="ts">
import { inject, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'

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
import HandIndex from '@/components/icons/HandIndex.vue'

import { parameters } from '@/lib/data/parameters'
import { useRoute, useRouter } from 'vue-router'
import type { Measurement } from '@/models/measurement'
import { openSummary, lastMeasurement, getAllMeasurements } from '@/lib/shared/utils'
import { HttpMeasurementService } from '@/services/measurement_service'
import { Provided } from '@/lib/provided'

const choiceOfParameters = ref(parameters)
const parameterListVisibility = ref(false)
const summaryOfMeasurements = ref<typeof Summary>()
const form = ref<HTMLFormElement>()
const alertCheckbox = ref<boolean>(false)
const alertCheckboxVisibility = ref<boolean>(false)
const parameterListElement = ref()
const latestMeasurements = ref<Measurement[]>([])

const router = useRouter()
const route = useRoute()
const patientId = `${route.params.patientId}`

const measurmentClient = inject<HttpMeasurementService>(Provided.MEASUREMENT_SERVICE)!

function toogleParameterList() {
    parameterListVisibility.value = !parameterListVisibility.value
}

function changeParameterVisibility(name: string) {
    for (let parameter of Object.values(choiceOfParameters.value)) {
        if (parameter.name === name) {
            parameter.chooseVisibility = !parameter.chooseVisibility
        }
    }
    changeAlertCheckboxVisibility()
}

function visibleParameters() {
    return Object.values(choiceOfParameters.value).filter(
        (parameter) => parameter.chooseVisibility === true
    )
}

function clearVisibility() {
    const parameters = visibleParameters()
    if (parameters.length > 0) {
        parameters.forEach((parameter) => (parameter.chooseVisibility = false))
    }
}

function showSelectedParameters() {
    const parameters = localStorage.getItem('selectedParameters')
    if (parameters) {
        for (let name of JSON.parse(parameters)) {
            changeParameterVisibility(name)
        }
    }
}

function changeAlertCheckboxVisibility() {
    const someParameterVisible = Object.values(choiceOfParameters.value).find(
        (parameter) => parameter.chooseVisibility === true
    )
    if (someParameterVisible) {
        alertCheckboxVisibility.value = true
    } else {
        alertCheckboxVisibility.value = false
    }
}

const clickOutsideHandler = (event: Event) => {
    if (parameterListElement.value && !parameterListElement.value.contains(event.target)) {
        parameterListVisibility.value = false
    }
}

function confirm() {
    const parameters = visibleParameters()
    const measurements = getAllMeasurements(parameters)
    measurmentClient.newMeasurements(patientId, measurements)
    summaryOfMeasurements.value?.close()
    alert('Medições salvas com sucesso!')
    if (alertCheckbox.value) {
        return router.push({ name: 'ScheduleAlert', params: { patientId } })
    }
    return router.push({ name: 'ExamGeneralCondition' })
}

onBeforeMount(() => {
    changeAlertCheckboxVisibility()
})

onMounted(async () => {
    latestMeasurements.value = await measurmentClient.latestMeasurements(patientId)
    showSelectedParameters()
    localStorage.clear()
    document.addEventListener('click', clickOutsideHandler)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', clickOutsideHandler)
    clearVisibility()
})
</script>
<template>
    <Header title="Escolha os parâmetros">
        <GoBack />
    </Header>
    <main class="main-content py-8">
        <section class="container">
            <ExamTime />
            <div class="relative space-y-2">
                <div
                    ref="parameterListElement"
                    @click="toogleParameterList"
                    class="flex items-center gap-2 border rounded ps-2 text-gray-500"
                >
                    <hand-index></hand-index>
                    <div class="form-contral flex-1 border-0 py-2 focus:ring-0">
                        Escolher parâmentros
                    </div>
                </div>
                <div
                    v-if="parameterListVisibility"
                    @click.stop
                    class="h-48 absolute w-full bg-white overflow-y-auto border rounded space-y-2 p-3"
                >
                    <div v-for="parameter in parameters" class="flex items-center">
                        <input
                            type="checkbox"
                            class="rounded focus:ring-0"
                            @change="changeParameterVisibility(parameter.name)"
                            :checked="parameter.chooseVisibility ? true : false"
                        />
                        <label
                            @click="changeParameterVisibility(parameter.name)"
                            class="ml-2 block text-gray-900"
                            >{{ parameter.title }}</label
                        >
                    </div>
                </div>
                <hr />
                <form ref="form" method="POST">
                    <div class="space-y-4">
                        <HeartRate
                            v-if="choiceOfParameters.heartRate.chooseVisibility"
                            :name="parameters.heartRate.name"
                            :title="parameters.heartRate.title"
                            :helpText="parameters.heartRate.helpText"
                            v-model="parameters.heartRate.measurement"
                            :last-measurement="
                                lastMeasurement(parameters.heartRate.name, latestMeasurements)
                            "
                        />
                        <RespiratoryRate
                            v-if="choiceOfParameters.respiratoryRate.chooseVisibility"
                            :name="choiceOfParameters.respiratoryRate.name"
                            :title="choiceOfParameters.respiratoryRate.title"
                            :helpText="choiceOfParameters.respiratoryRate.helpText"
                            v-model="choiceOfParameters.respiratoryRate.measurement"
                            :last-measurement="
                                lastMeasurement(parameters.respiratoryRate.name, latestMeasurements)
                            "
                        />
                        <TRC
                            v-if="choiceOfParameters.trc.chooseVisibility"
                            :name="parameters.trc.name"
                            :title="parameters.trc.title"
                            :helpText="parameters.trc.helpText"
                            v-model="parameters.trc.measurement"
                            :last-measurement="
                                lastMeasurement(parameters.trc.name, latestMeasurements)
                            "
                        />
                        <AVDN
                            v-if="choiceOfParameters.avdn.chooseVisibility"
                            :name="parameters.avdn.name"
                            :title="parameters.avdn.title"
                            :options="parameters.avdn.options"
                            v-model="parameters.avdn.measurement"
                            :last-measurement="
                                lastMeasurement(parameters.avdn.name, latestMeasurements)
                            "
                        />
                        <Mucosas
                            v-if="choiceOfParameters.mucosas.chooseVisibility"
                            :name="parameters.mucosas.name"
                            :title="parameters.mucosas.title"
                            :options="parameters.mucosas.options"
                            v-model="parameters.mucosas.measurement"
                            :last-measurement="
                                lastMeasurement(parameters.mucosas.name, latestMeasurements)
                            "
                        />
                        <Temperature
                            v-if="choiceOfParameters.temperature.chooseVisibility"
                            :name="parameters.temperature.name"
                            :title="parameters.temperature.title"
                            :helpText="parameters.temperature.helpText"
                            v-model="parameters.temperature.measurement"
                            :last-measurement="
                                lastMeasurement(parameters.temperature.name, latestMeasurements)
                            "
                        />
                        <Glicemia
                            v-if="choiceOfParameters.glicemia.chooseVisibility"
                            :name="parameters.glicemia.name"
                            :title="parameters.glicemia.title"
                            :helpText="parameters.glicemia.helpText"
                            v-model="parameters.glicemia.measurement"
                            :last-measurement="
                                lastMeasurement(parameters.glicemia.name, latestMeasurements)
                            "
                        />
                        <HCT
                            v-if="choiceOfParameters.hct.chooseVisibility"
                            :name="parameters.hct.name"
                            :title="parameters.hct.title"
                            :helpText="parameters.hct.helpText"
                            v-model="parameters.hct.measurement"
                            :last-measurement="
                                lastMeasurement(parameters.hct.name, latestMeasurements)
                            "
                        />
                        <BloodPressure
                            v-if="choiceOfParameters.bloodPressure.chooseVisibility"
                            :name="parameters.bloodPressure.name"
                            :title="parameters.bloodPressure.title"
                            :type="parameters.bloodPressure.type"
                            :helpText="parameters.bloodPressure.helpText"
                            v-model="parameters.bloodPressure.measurement"
                            :last-measurement="
                                lastMeasurement(parameters.bloodPressure.name, latestMeasurements)
                            "
                        />
                        <div v-if="alertCheckboxVisibility" class="flex items-center">
                            <input
                                type="checkbox"
                                class="focus:ring-0 rounded"
                                v-model="alertCheckbox"
                            />
                            <label
                                class="ml-2 block text-gray-900"
                                @click="() => (alertCheckbox = !alertCheckbox)"
                            >
                                Criar alerta de monitorização
                            </label>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    </main>
    <Footer>
        <button
            type="button"
            class="btn-success"
            @click="openSummary(form!, summaryOfMeasurements, visibleParameters())"
        >
            Salvar
        </button>
    </Footer>
    <Summary ref="summaryOfMeasurements" title="Detalhes">
        <button class="btn-success" @click="confirm()">Confirmar</button>
    </Summary>
</template>
@/models/measurement
