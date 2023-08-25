<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'

import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import SaveButton from '@/components/Button.vue'
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

import SearchIcon from 'vue-material-design-icons/Magnify.vue'

import { parameters } from '@/data/parameters'
import { useRoute, useRouter } from 'vue-router'

type Parameter = {
    name: string,
    title: string
}

const chooseParameters = ref(parameters)
const parametersList = ref(false)
const scheduleAlert = ref<boolean>(false)
const showScheduleAlert = ref(false)
const dropdown = ref()

// const router = useRouter()
const route = useRoute()
const patientId = `${route.params.patientId}`
const selectedParameters: Parameter[] = JSON.parse(localStorage.getItem('parameters') as string)

const clickOutsideHandler = (event: Event) => {
    if (dropdown.value && !dropdown.value.contains(event.target)) {
        parametersList.value = false;
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
    const isVisibleSomeParameter = Object.values(chooseParameters.value).find(
        (parameter) => parameter.chooseVisibility === true
    )
    if (isVisibleSomeParameter) {
        showScheduleAlert.value = true
    } else {
        showScheduleAlert.value = false
    }
}

function toogleParameterList() {
    parametersList.value = !parametersList.value
}

function save(){
    // const isValidForm = validateForm()
    // console.log(isValidForm)
}

onBeforeMount(() => {
    showScheduleAlertCheckbox()
})

onMounted(() => {
    document.addEventListener("click", clickOutsideHandler);
    if (selectedParameters) {
        for (let parameter of selectedParameters){
            changeParameterVisibility(parameter.name)
        }
    }
})

onBeforeUnmount(() => {
    document.removeEventListener("click", clickOutsideHandler);
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
                <div ref="dropdown" @click="toogleParameterList"  class="flex items-center gap-2 border rounded ps-2 text-gray-500">
                    <search-icon></search-icon>
                    <div class="form-contral flex-1 border-0 py-2 focus:ring-0">
                        Escolher parâmentros
                    </div>
                </div>
                <div 
                    v-if="parametersList" 
                    @click.stop
                    class="h-48 absolute w-full bg-white overflow-y-auto border rounded space-y-2 p-3"
                    >
                    <div v-for="parameter in parameters" class="flex items-center">
                        <input
                            type="checkbox"
                            class="rounded"
                            @change="changeParameterVisibility(parameter.name)"
                            :checked="parameter.chooseVisibility ? true : false"
                        />
                        <label class="ml-2 block text-gray-900">{{ parameter.title }}</label>
                    </div>
                </div>
                <hr />
                <form id="parameters" method="POST">
                    <div class="space-y-4">
                        <HeartRate
                            v-if="chooseParameters.heartRate.chooseVisibility"
                            :name="parameters.heartRate.name"
                            :title="parameters.heartRate.title"
                            :helpText="parameters.heartRate.helpText"
                            v-model="parameters.heartRate.value"
                        />
                        <RespiratoryRate
                            v-if="chooseParameters.respiratoryRate.chooseVisibility"
                            :name="chooseParameters.respiratoryRate.name"
                            :title="chooseParameters.respiratoryRate.title"
                            v-model="chooseParameters.respiratoryRate.value"
                        />
                        <TRC
                            v-if="chooseParameters.trc.chooseVisibility"
                            :name="parameters.trc.name"
                            :title="parameters.trc.title"
                            :helpText="parameters.trc.helpText"
                            v-model="parameters.trc.value"
                        />
                        <AVDN
                            v-if="chooseParameters.avdn.chooseVisibility"
                            :name="parameters.avdn.name"
                            :title="parameters.avdn.title"
                            :options="parameters.avdn.options"
                            v-model="parameters.avdn.value"
                        />
                        <Mucosas
                            v-if="chooseParameters.mucosas.chooseVisibility"
                            :name="parameters.mucosas.name"
                            :title="parameters.mucosas.title"
                            :options="parameters.mucosas.options"
                            v-model="parameters.mucosas.value"
                        />
                        <Temperature
                            v-if="chooseParameters.temperature.chooseVisibility"
                            :name="parameters.temperature.name"
                            :title="parameters.temperature.title"
                            :helpText="parameters.temperature.helpText"
                            v-model="parameters.temperature.value"
                        />
                        <Glicemia
                            v-if="chooseParameters.glicemia.chooseVisibility"
                            :name="parameters.glicemia.name"
                            :title="parameters.glicemia.title"
                            :helpText="parameters.glicemia.helpText"
                            v-model="parameters.glicemia.value"
                        />
                        <HCT
                            v-if="chooseParameters.hct.chooseVisibility"
                            :name="parameters.hct.name"
                            :title="parameters.hct.title"
                            :helpText="parameters.hct.helpText"
                            v-model="parameters.hct.value"
                        />
                        <BloodPressure
                            v-if="chooseParameters.bloodPressure.chooseVisibility"
                            :name="parameters.bloodPressure.name"
                            :title="parameters.bloodPressure.title"
                            :type="parameters.bloodPressure.type"
                            :helpText="parameters.bloodPressure.helpText"
                            v-model="parameters.bloodPressure.value"
                        />
                        <div v-if="showScheduleAlert" class="flex items-center">
                            <input type="checkbox" class="rounded" v-model="scheduleAlert" />
                            <label for="create-alert" class="ml-2 block text-gray-900">
                                Criar alerta de monitorização
                            </label>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    </main>
    <Footer>
        <SaveButton class="btn-success" title="Salvar"
        @click="save" />
    </Footer>
</template>
