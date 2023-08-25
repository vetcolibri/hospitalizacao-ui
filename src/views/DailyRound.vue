<script setup lang="ts">
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

import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { parameters } from '@/data/parameters'
import PATIENTS from '@/data/patients'

const dailyRound = ref(parameters)
const scheduleAlert = ref<boolean>(false)
const router = useRouter()
const route = useRoute()
const patientId = `${route.params.patientId}`
const form = ref<HTMLFormElement>()

function clearForm(){
    for(let parameter of Object.values(dailyRound.value)){
        parameter.value = ''
    }
}

function sumbitData() {
    const formData = Object.values(dailyRound.value)
    const patient = PATIENTS.find((patient) => patient.id === patientId)
    for (let parameter of formData){
        const data = {
            parameter: parameter.name,
            value: parameter.value,
            hour: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString()
        }
        patient?.measurements.push(data)
    }
    clearForm()
    alert("Medições da ronda diária salvas com sucesso.")
}

function lastMeasurement(parameter: string) {
    const patient = PATIENTS.find((patient) => patient.id === patientId)
    if (!patient) return
    const measurements = patient.measurements.filter((item) => item.parameter === parameter)
    const measurement = measurements[measurements.length - 1]
    return measurement
}

function save(){
    let isValid = form.value?.checkValidity()
    if(isValid && scheduleAlert.value === true){
        sumbitData()
        router.push({name: 'ScheduleAlert'})
    }
    if (isValid && scheduleAlert.value === false){
        sumbitData()
        router.push({name: 'ExamGeneralCondition'})
    }
}
</script>
<template>
    <div>
        <Header title="Ronda diária">
            <GoBack />
        </Header>
        <main class="main-content py-8">
            <section class="bg-white shadow px-8 py-6">
                <ExamTime />
                <form ref="form" class="grid grid-row-1 space-y-4">
                    <HeartRate
                        :name="parameters.heartRate.name"
                        :title="parameters.heartRate.title"
                        :helpText="parameters.heartRate.helpText"
                        :lastMeasurement="lastMeasurement(parameters.heartRate.name)"
                        v-model="parameters.heartRate.value"
                    />
                    <RespiratoryRate
                        :name="parameters.respiratoryRate.name"  
                        :title="parameters.respiratoryRate.title"
                        :helpText="parameters.respiratoryRate.helpText"
                        :lastMeasurement="lastMeasurement(parameters.respiratoryRate.name)"
                        v-model="parameters.respiratoryRate.value"
                    />
                    <TRC
                        :name="parameters.trc.name"  
                        :title="parameters.trc.title"
                        :helpText="parameters.trc.helpText"
                        :lastMeasurement="lastMeasurement(parameters.trc.name)"
                        v-model="parameters.trc.value" 
                    />
                    <AVDN
                        :name="parameters.avdn.name" 
                        :title="parameters.avdn.title"
                        :options="parameters.avdn.options"
                        :lastMeasurement="lastMeasurement(parameters.avdn.name)"
                        v-model="parameters.avdn.value"  
                    />
                    <Mucosas
                        :name="parameters.mucosas.name" 
                        :title="parameters.mucosas.title"
                        :options="parameters.mucosas.options"
                        :lastMeasurement="lastMeasurement(parameters.mucosas.name)"
                        v-model="parameters.mucosas.value"  
                    />

                    <Temperature 
                        :name="parameters.temperature.name" 
                        :title="parameters.temperature.title"
                        :helpText="parameters.temperature.helpText"
                        :lastMeasurement="lastMeasurement(parameters.temperature.name)"
                        v-model="parameters.temperature.value"  
                    />
                    <Glicemia 
                        :name="parameters.glicemia.name" 
                        :title="parameters.glicemia.title"
                        :helpText="parameters.glicemia.helpText"
                        :lastMeasurement="lastMeasurement(parameters.glicemia.name)"
                        v-model="parameters.glicemia.value"  
                    />
                    <HCT 
                        :name="parameters.hct.name" 
                        :title="parameters.hct.title"
                        :helpText="parameters.hct.helpText"
                        :lastMeasurement="lastMeasurement(parameters.hct.name)"
                        v-model="parameters.hct.value" 
                    />
                    <BloodPressure 
                        :name="parameters.bloodPressure.name" 
                        :title="parameters.bloodPressure.title"
                        :type="parameters.bloodPressure.type"
                        :helpText="parameters.bloodPressure.helpText"
                        :lastMeasurement="lastMeasurement(parameters.bloodPressure.name)"
                        v-model="parameters.bloodPressure.value"  
                    />
                    <div class="flex items-center">
                        <input type="checkbox" class="rounded" v-model="scheduleAlert"/>
                        <label for="create-alert" class="ml-2 block text-gray-900">
                            Criar alerta de monitorização
                        </label>
                    </div>
                </form>
            </section>
        </main>
        <Footer>
            <SaveButton class="btn-success" title="Salvar" @click="save"/>
        </Footer>
    </div>
</template>