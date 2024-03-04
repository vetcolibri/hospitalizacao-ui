<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import HeartRate from '@/components/parameters/ParameterHeartRate.vue'
import RespiratoryRate from '@/components/parameters/ParameterRespiratoryRate.vue'
import Trc from '@/components/parameters/ParameterTrc.vue'
import Avdn from '@/components/parameters/ParameterAvdn.vue'
import Mucosas from '@/components/parameters/ParameterMucosas.vue'
import Temperature from '@/components/parameters/ParameterTemperature.vue'
import Glicemia from '@/components/parameters/ParameterGlicemia.vue'
import Hct from '@/components/parameters/ParameterHct.vue'
import BloodPressure from '@/components/parameters/ParameterBloodPressure.vue'
import Summary from '@/components/parameters/ParametersSummary.vue'
import RoundTime from '@/components/RoundTime.vue'

import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'

import { states } from '@/lib/data/parameters_state'
import { Provided } from '@/lib/provided'
import { getLatestMeasurement } from '@/lib/shared/utils'
import { useParametersStore } from '@/lib/store/parametersStore'
import { usePatientSelectedStore } from '@/lib/store/patientStore'
import type { IRoundService } from '@/lib/services/round_service'
import type { Measurement } from '@/lib/models/measurement'

const form = ref<HTMLFormElement>()
const showParameters = ref(false)
const showAlertCheckbox = ref<boolean>(false)
const parametersState = ref(states)
const parametersMenuEl = ref()
const alertCheckbox = ref<boolean>(false)
const router = useRouter()
const parametersSummaryRef = ref<typeof Summary>()
const parametersStore = useParametersStore()
const roundService = inject<IRoundService>(Provided.RoundService)!
const latestMeasurements = ref<Measurement[]>([])
const patientStore = usePatientSelectedStore()

function toogleParameterList() {
    showParameters.value = !showParameters.value
}

function records() {
    return Object.values(parametersState.value)
}

function entries() {
    return Object.entries(parametersState.value)
}

function changeVisibility(id: string) {
    const parameter = records().find((parameter) => parameter.id === id)
    parameter!.visibility = !parameter!.visibility
    changeAlertCheckboxVisibility()
}

function changeAlertCheckboxVisibility() {
    const parameters = records()
    const visibleParameter = parameters.some((parameter) => parameter.visibility)
    if (visibleParameter && showAlertCheckbox.value === false) {
        showAlertCheckbox.value = true
        return
    }
    if (!visibleParameter && showAlertCheckbox.value === true) {
        showAlertCheckbox.value = false
        return
    }
}

function clearVisibility() {
    records()
        .filter((parameter) => parameter.visibility === true)
        .forEach((parameter) => {
            parameter.visibility = false
        })
    showAlertCheckbox.value = false
}

function closeParametersMenu(event: Event) {
    if (parametersMenuEl.value && !parametersMenuEl.value.contains(event.target)) {
        showParameters.value = false
    }
}

function showParameter(name: string) {
    entries()
        .filter(([key, _]) => key === name)
        .forEach(([_, parameter]) => {
            changeVisibility(parameter.id)
        })
}

function showParametersInStore() {
    const parameters = parametersStore.getParameters
    if (parameters.length === 0) return

    parameters.forEach((parameter) => {
        showParameter(parameter)
    })

    parametersStore.clear()
}

function isInvalid() {
    return !form.value?.checkValidity() || form.value?.elements.length === 0
}

function selectAlertCheckbox() {
    alertCheckbox.value = !alertCheckbox.value
}

function confirm() {
    if (isInvalid()) {
        return form.value?.reportValidity()
    }

    const parameters = records().filter((parameter) => parameter.visibility === true)
    parametersSummaryRef.value?.add(parameters)
    parametersSummaryRef.value?.open()
}

async function save() {
    const parameters = entries()
        .filter(([_, parameter]) => parameter.visibility === true)
        .map(([key, parameter]) => ({ [key]: { value: parameter.value } }))
        .reduce((acc, cur) => ({ ...acc, ...cur }), {})

    const voidOrError = await roundService.newRound(patientStore.patient, parameters)
    if (voidOrError.isLeft()) {
        alert('Não foi possível salvar os parâmetros')
        console.error(voidOrError.value)
        return
    }

    parametersSummaryRef.value?.close()

    clearVisibility()

    alert('Parâmetros salvos com sucesso')

    if (alertCheckbox.value) {
        router.push({ name: 'ScheduleAlert' })
        return
    }

    router.push({ name: 'Dashboard' })
}

onMounted(async () => {
    if (!patientStore.patient) return router.back()

    clearVisibility()

    document.addEventListener('click', closeParametersMenu)

    const measurementsOrError = await roundService.latestMeasurements(patientStore.patient)

    if (measurementsOrError.isLeft()) return

    latestMeasurements.value = measurementsOrError.value

    showParametersInStore()
})
</script>
<template>
    <Header title="Escolha os parâmetros">
        <GoBack />
    </Header>
    <main class="main-content">
        <section class="container my-8">
            <RoundTime />
            <section class="relative space-y-2">
                <div
                    ref="parametersMenuEl"
                    class="flex items-center border gap-3 px-2 rounded text-gray-500"
                >
                    <i class="bi bi-hand-index text-lg md:text-xl" @click="toogleParameterList"></i>
                    <div
                        class="flex-1 border-0 py-2 cursor-pointer focus:ring-0"
                        @click="toogleParameterList"
                    >
                        Escolher parâmetros
                    </div>
                    <i
                        class="bi bi-arrow-clockwise text-lg cursor-pointer md:text-xl"
                        @click="clearVisibility"
                    ></i>
                </div>
                <div
                    v-if="showParameters"
                    class="absolute w-full bg-white overflow-y-auto border rounded space-y-2 p-3"
                    @click.stop
                >
                    <div
                        v-for="parameter in parametersState"
                        :key="parameter.id"
                        class="flex items-center gap-2 text-gray-900"
                        @click="changeVisibility(parameter.id)"
                    >
                        <input
                            type="checkbox"
                            class="rounded focus:ring-0"
                            :checked="parameter.visibility"
                        />
                        <label>{{ parameter.name }}</label>
                    </div>
                </div>
                <hr />
                <form ref="form">
                    <div class="space-y-4">
                        <HeartRate
                            v-if="parametersState.heartRate.visibility"
                            v-model="parametersState.heartRate.value"
                            :latest-measurement="
                                getLatestMeasurement('heartRate', latestMeasurements)
                            "
                            @state="parametersState.heartRate.state = $event"
                        />
                        <RespiratoryRate
                            v-if="parametersState.respiratoryRate.visibility"
                            v-model="parametersState.respiratoryRate.value"
                            :latest-measurement="
                                getLatestMeasurement('respiratoryRate', latestMeasurements)
                            "
                            @state="parametersState.respiratoryRate.state = $event"
                        />
                        <Trc
                            v-if="parametersState.trc.visibility"
                            v-model="parametersState.trc.value"
                            :latest-measurement="getLatestMeasurement('trc', latestMeasurements)"
                            @state="parametersState.trc.state = $event"
                        />
                        <Avdn
                            v-if="parametersState.avdn.visibility"
                            v-model="parametersState.avdn.value"
                            :latest-measurement="getLatestMeasurement('avdn', latestMeasurements)"
                            @state="parametersState.avdn.state = $event"
                        />
                        <Mucosas
                            v-if="parametersState.mucosas.visibility"
                            v-model="parametersState.mucosas.value"
                            :latest-measurement="
                                getLatestMeasurement('mucosas', latestMeasurements)
                            "
                            @state="parametersState.mucosas.state = $event"
                        />
                        <Temperature
                            v-if="parametersState.temperature.visibility"
                            v-model="parametersState.temperature.value"
                            :latest-measurement="
                                getLatestMeasurement('temperature', latestMeasurements)
                            "
                            @state="parametersState.temperature.state = $event"
                        />
                        <Glicemia
                            v-if="parametersState.bloodGlucose.visibility"
                            v-model="parametersState.bloodGlucose.value"
                            :latest-measurement="
                                getLatestMeasurement('bloodGlucose', latestMeasurements)
                            "
                            @state="parametersState.bloodGlucose.state = $event"
                        />
                        <Hct
                            v-if="parametersState.hct.visibility"
                            v-model="parametersState.hct.value"
                            :latest-measurement="getLatestMeasurement('hct', latestMeasurements)"
                            @state="parametersState.hct.state = $event"
                        />
                        <BloodPressure
                            v-if="parametersState.bloodPressure.visibility"
                            v-model="parametersState.bloodPressure.value"
                            :latest-measurement="
                                getLatestMeasurement('bloodPressure', latestMeasurements)
                            "
                            @state="parametersState.bloodPressure.state = $event"
                        />
                        <div v-if="showAlertCheckbox" class="flex items-center">
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
        </section>
    </main>
    <Summary ref="parametersSummaryRef">
        <button class="btn btn-success space-x-2" @click="save()">
            <i class="bi bi-floppy2"></i>
            <span class="font-semibold">Salvar</span>
        </button>
    </Summary>
    <Footer>
        <button class="btn btn-secondary" @click="confirm()">Confirmar</button>
    </Footer>
</template>
