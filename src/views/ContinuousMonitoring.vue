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
import ExamTime from '@/components/ExamTime.vue'

import { ref, onMounted, inject } from 'vue'
import { states } from '@/lib/data/parameters_state'
import { useParametersStore } from '@/store/parametersStore'
import { Provided } from '@/lib/provided'
import { useRoute } from 'vue-router'
import type { MeasurementService } from '@/services/measurement_service'
import type { Measurement } from '@/models/measurement'
import router from '@/router'

const route = useRoute()
const form = ref<HTMLFormElement>()
const showParameters = ref(false)
const showAlertCheckbox = ref<boolean>(false)
const parametersState = ref(states)
const parametersMenuEl = ref()
const alertCheckbox = ref<boolean>(false)
const parametersSummaryRef = ref<typeof Summary>()
const parametersStore = useParametersStore()
const measurementService = inject<MeasurementService>(Provided.MEASUREMENT_SERVICE)!
const patientId = route.params.patientId as string
const latestMeasurements = ref<Partial<Measurement[]>>([])

function toogleParameterList() {
    showParameters.value = !showParameters.value
}

function records() {
    return Object.values(parametersState.value)
}

function changeVisibility(id: string) {
    for (const parameter of records()) {
        if (parameter.id === id) {
            parameter.visibility = !parameter.visibility
            changeAlertCheckboxVisibility()
            return
        }
    }
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
    const parameters = records()
    const visibleParameters = parameters.filter((parameter) => parameter.visibility === true)
    visibleParameters.forEach((parameter) => {
        parameter.visibility = false
    })
    showAlertCheckbox.value = false
}

function closeParametersMenu(event: Event) {
    if (parametersMenuEl.value && !parametersMenuEl.value.contains(event.target)) {
        showParameters.value = false
    }
}

function showParametersInStore() {
    if (parametersStore.getParameters.length > 0) {
        for (let name of parametersStore.getParameters) {
            for (let parameter of Object.entries(parametersState.value)) {
                if (name === parameter[0]) {
                    changeVisibility(parameter[1].id)
                }
            }
        }
        parametersStore.clear()
    }
}

function getLatestMeasurement(name: string) {
    if (latestMeasurements.value.length > 0) {
        for (let measurement of latestMeasurements.value) {
            if (measurement!.name === name) {
                return {
                    value: measurement!.value,
                    date: measurement!.issudeAt
                }
            }
        }
    }
}

function confirm() {
    if (!form.value?.checkValidity() || form.value?.elements.length === 0) {
        return form.value?.reportValidity()
    }
    const parameters = records()
    parametersSummaryRef.value?.addParameters(parameters)
    parametersSummaryRef.value?.open()
}

async function save() {
    let parameters = {}
    const resultOrError = await measurementService.newMeasurements(patientId, parameters)
    if (resultOrError.isLeft()) {
        alert('Não foi possível salvar os parâmetros')
        return
    }
    parametersSummaryRef.value?.close()
    clearVisibility()
    alert('Parâmetros salvos com sucesso')
    if (alertCheckbox) {
        router.push({ name: 'ScheduleAlert', params: { patientId } })
        return
    }
    router.push({ name: 'Dashboard' })
}

onMounted(async () => {
    document.addEventListener('click', closeParametersMenu)
    showParametersInStore()
    const resultOrError = await measurementService.latestMeasurements(patientId)
    if (resultOrError.isLeft()) {
        return
    }
    latestMeasurements.value = resultOrError.value
})
</script>
<template>
    <Header title="Escolha os parâmetros">
        <GoBack />
    </Header>
    <main class="main-content">
        <section class="px-12">
            <section class="container mt-8">
                <ExamTime />
                <section class="relative space-y-2">
                    <div
                        ref="parametersMenuEl"
                        class="flex items-center border gap-3 px-2 rounded text-gray-500"
                    >
                        <i
                            class="bi bi-hand-index text-base md:text-xl"
                            @click="toogleParameterList"
                        ></i>
                        <div class="flex-1 border-0 py-2 focus:ring-0" @click="toogleParameterList">
                            Escolher parâmetros
                        </div>
                        <i
                            class="bi bi-arrow-clockwise text-base md:text-xl"
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
                                :latest-measurement="getLatestMeasurement('heartRate')"
                                @state="parametersState.heartRate.state = $event"
                            />
                            <RespiratoryRate
                                v-if="parametersState.respiratoryRate.visibility"
                                v-model="parametersState.respiratoryRate.value"
                                :latest-measurement="getLatestMeasurement('respiratoryRate')"
                                @state="parametersState.respiratoryRate.state = $event"
                            />
                            <Trc
                                v-if="parametersState.trc.visibility"
                                v-model="parametersState.trc.value"
                                :latest-measurement="getLatestMeasurement('trc')"
                                @state="parametersState.trc.state = $event"
                            />
                            <Avdn
                                v-if="parametersState.avdn.visibility"
                                v-model="parametersState.avdn.value"
                                :latest-measurement="getLatestMeasurement('avdn')"
                                @state="parametersState.avdn.state = $event"
                            />
                            <Mucosas
                                v-if="parametersState.mucosas.visibility"
                                v-model="parametersState.mucosas.value"
                                :latest-measurement="getLatestMeasurement('mucosas')"
                                @state="parametersState.mucosas.state = $event"
                            />
                            <Temperature
                                v-if="parametersState.temperature.visibility"
                                v-model="parametersState.temperature.value"
                                :latest-measurement="getLatestMeasurement('temperature')"
                                @state="parametersState.temperature.state = $event"
                            />
                            <Glicemia
                                v-if="parametersState.glicemia.visibility"
                                v-model="parametersState.glicemia.value"
                                :latest-measurement="getLatestMeasurement('bloodGlucose')"
                                @state="parametersState.glicemia.state = $event"
                            />
                            <Hct
                                v-if="parametersState.hct.visibility"
                                v-model="parametersState.hct.value"
                                :latest-measurement="getLatestMeasurement('hct')"
                                @state="parametersState.hct.state = $event"
                            />
                            <BloodPressure
                                v-if="parametersState.bloodPressure.visibility"
                                v-model="parametersState.bloodPressure.value"
                                :latest-measurement="getLatestMeasurement('bloodPressure')"
                                @state="parametersState.bloodPressure.state = $event"
                            />
                            <div v-if="showAlertCheckbox" class="flex items-center">
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
                </section>
            </section>
        </section>
    </main>
    <Summary ref="parametersSummaryRef">
        <button class="btn btn-success space-x-3" @click="save()">
            <i class="bi bi-floppy2"></i>
            <span class="font-semibold">Salvar</span>
        </button>
    </Summary>
    <Footer>
        <button class="btn btn-secondary" @click="confirm()">Confirmar</button>
    </Footer>
</template>
