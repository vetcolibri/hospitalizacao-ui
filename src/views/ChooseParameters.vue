<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'

import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import Button from '@/components/Button.vue'
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

import HandIndex from '@/components/icons/HandIndex.vue'

import { parameters } from '@/lib/data/parameters'
import { sendData } from '@/lib/shared/utils'
import { useRoute, useRouter } from 'vue-router'
import Dialog from '@/components/Dialog.vue'

type Parameter = {
    name: string
    title: string
}

const chooseParameters = ref(parameters)
const parametersList = ref(false)
const scheduleAlert = ref<boolean>(false)
const showScheduleAlert = ref(false)
const form = ref<HTMLFormElement>()
const dialogElement = ref<typeof Dialog>()
const dropdown = ref()

const router = useRouter()
const route = useRoute()
const patientId = `${route.params.patientId}`
const selectedParameters: Parameter[] = JSON.parse(localStorage.getItem('parameters') as string)

function toogleParameterList() {
    parametersList.value = !parametersList.value
}

const clickOutsideHandler = (event: Event) => {
    if (dropdown.value && !dropdown.value.contains(event.target)) {
        parametersList.value = false
    }
}

function changeParameterVisibility(name: string) {
    for (let parameter of Object.values(chooseParameters.value)) {
        if (parameter.name === name) {
            parameter.chooseVisibility = !parameter.chooseVisibility
        }
    }
    showScheduleAlertCheckbox()
}

function showScheduleAlertCheckbox() {
    const isVisible = Object.values(chooseParameters.value).find(
        (parameter) => parameter.chooseVisibility === true
    )
    if (isVisible) {
        showScheduleAlert.value = true
    } else {
        showScheduleAlert.value = false
    }
}

function showSelectedParameters() {
    if (selectedParameters) {
        for (let parameter of selectedParameters) {
            changeParameterVisibility(parameter.name)
        }
    }
}

function visibleParameters() {
    return Object.values(chooseParameters.value).filter(
        (parameter) => parameter.chooseVisibility === true
    )
}

function openResume() {
    if (!form.value?.checkValidity()) {
        return form.value?.reportValidity()
    }
    const parameters = visibleParameters()
    if (parameters.length > 0) {
        dialogElement.value?.addParameters(parameters)
        dialogElement.value?.show()
    }
}

function clearVisibility() {
    const parameters = visibleParameters()
    if (parameters.length > 0) {
        parameters.forEach((parameter) => (parameter.chooseVisibility = false))
    }
}

function confirm() {
    sendData()
    dialogElement.value?.close()
    if (scheduleAlert.value) {
        return router.push({ name: 'ScheduleAlert' })
    }
    return router.push({ name: 'ExamGeneralCondition' })
}

onBeforeMount(() => {
    showScheduleAlertCheckbox()
})

onMounted(() => {
    document.addEventListener('click', clickOutsideHandler)
    showSelectedParameters()
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
        <section class="bg-white shadow px-8 py-6 space-y-3">
            <ExamTime />
            <div class="relative space-y-2">
                <div ref="dropdown" @click="toogleParameterList"
                    class="flex items-center gap-2 border rounded ps-2 text-gray-500">
                    <hand-index></hand-index>
                    <div class="form-contral flex-1 border-0 py-2 focus:ring-0">
                        Escolher parâmentros
                    </div>
                </div>
                <div v-if="parametersList" @click.stop
                    class="h-48 absolute w-full bg-white overflow-y-auto border rounded space-y-2 p-3">
                    <div v-for="parameter in parameters" class="flex items-center">
                        <input type="checkbox" class="rounded focus:ring-0"
                            @change="changeParameterVisibility(parameter.name)"
                            :checked="parameter.chooseVisibility ? true : false" />
                        <label @click="changeParameterVisibility(parameter.name)" class="ml-2 block text-gray-900">{{
                            parameter.title }}</label>
                    </div>
                </div>
                <hr />
                <form ref="form" method="POST">
                    <div class="space-y-4">
                        <HeartRate v-if="chooseParameters.heartRate.chooseVisibility" :name="parameters.heartRate.name"
                            :title="parameters.heartRate.title" :helpText="parameters.heartRate.helpText"
                            v-model="parameters.heartRate.measurement" />
                        <RespiratoryRate v-if="chooseParameters.respiratoryRate.chooseVisibility"
                            :name="chooseParameters.respiratoryRate.name" :title="chooseParameters.respiratoryRate.title"
                            :helpText="chooseParameters.respiratoryRate.helpText"
                            v-model="chooseParameters.respiratoryRate.measurement" />
                        <TRC v-if="chooseParameters.trc.chooseVisibility" :name="parameters.trc.name"
                            :title="parameters.trc.title" :helpText="parameters.trc.helpText"
                            v-model="parameters.trc.measurement" />
                        <AVDN v-if="chooseParameters.avdn.chooseVisibility" :name="parameters.avdn.name"
                            :title="parameters.avdn.title" :options="parameters.avdn.options"
                            v-model="parameters.avdn.measurement" />
                        <Mucosas v-if="chooseParameters.mucosas.chooseVisibility" :name="parameters.mucosas.name"
                            :title="parameters.mucosas.title" :options="parameters.mucosas.options"
                            v-model="parameters.mucosas.measurement" />
                        <Temperature v-if="chooseParameters.temperature.chooseVisibility"
                            :name="parameters.temperature.name" :title="parameters.temperature.title"
                            :helpText="parameters.temperature.helpText" v-model="parameters.temperature.measurement" />
                        <Glicemia v-if="chooseParameters.glicemia.chooseVisibility" :name="parameters.glicemia.name"
                            :title="parameters.glicemia.title" :helpText="parameters.glicemia.helpText"
                            v-model="parameters.glicemia.measurement" />
                        <HCT v-if="chooseParameters.hct.chooseVisibility" :name="parameters.hct.name"
                            :title="parameters.hct.title" :helpText="parameters.hct.helpText"
                            v-model="parameters.hct.measurement" />
                        <BloodPressure v-if="chooseParameters.bloodPressure.chooseVisibility"
                            :name="parameters.bloodPressure.name" :title="parameters.bloodPressure.title"
                            :type="parameters.bloodPressure.type" :helpText="parameters.bloodPressure.helpText"
                            v-model="parameters.bloodPressure.measurement" />
                        <div v-if="showScheduleAlert" class="flex items-center">
                            <input type="checkbox" class="focus:ring-0 rounded" v-model="scheduleAlert" />
                            <label class="ml-2 block text-gray-900" @click="() => (scheduleAlert = !scheduleAlert)">
                                Criar alerta de monitorização
                            </label>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    </main>
    <Footer>
        <Button class="btn-success" title="Salvar" @click="openResume()" />
    </Footer>
    <Dialog ref="dialogElement" title="Detalhes">
        <button class="btn-secondary" @click="confirm()">Confirmar</button>
    </Dialog>
</template>
