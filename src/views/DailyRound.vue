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

import { makeToday, makeHour } from '@/utils/tools'
import { parameters } from '@/data/parameters'
import PATIENTS from '@/data/patients'

const today = makeToday()
const hour = makeHour()
const dailyRound = ref(parameters)
const createAlert = ref<boolean>(false)
const router = useRouter()
const route = useRoute()
const patientId = `${route.params.patientId}`

function removeInvalidClass(parameter: string) {
    const element = document.getElementsByName(parameter)[0]
    if (element.classList.contains('form-invalid')) element.className = 'form-control'
}

function addInvalidClass(parameter: string) {
    const element = document.getElementsByName(parameter)[0]
    element.className = 'form-invalid'
}

function validForm() {
    let count = 0
    for (let parameter of dailyRound.value){
        if ( parameter.value){
            count++
            removeInvalidClass(parameter.name)
        } else {
            addInvalidClass(parameter.name)
        }
    }
    return count === dailyRound.value.length
}

function cleanUpForm(){
    for(let parameter of dailyRound.value){
        parameter.value = ''
    }
}

function sumbitData() {
    const formData = dailyRound.value
    const patient = PATIENTS.find((patient) => patient.id === patientId)
    for (let element of formData){
        const data = {
            parameter: element.name,
            value: element.value,
            hour: makeHour(),
            date: makeToday()
        }
        patient?.measurements.push(data)
    }
    cleanUpForm()
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
    console.log(dailyRound.value)
    const isValidForm = validForm()
    if(isValidForm && createAlert.value === true){
        sumbitData()
        router.push({name: 'ScheduleAlert'})
    }
    if (isValidForm && createAlert.value === false){
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
                <ExamTime :today="today" :hour="hour" />
                <form class="grid grid-row-1 space-y-4">
                    <HeartRate
                        :name="parameters[0].name"
                        :title="parameters[0].title"
                        :helpText="parameters[0].helpText"
                        :lastMeasurement="lastMeasurement(parameters[0].name)"
                        v-model="parameters[0].value"
                    />
                    <RespiratoryRate
                        :name="parameters[1].name"  
                        :title="parameters[1].title"
                        :helpText="parameters[1].helpText"
                        :lastMeasurement="lastMeasurement(parameters[1].name)"
                        v-model="parameters[1].value"
                    />
                    <TRC
                        :name="parameters[2].name"  
                        :title="parameters[2].title"
                        :helpText="parameters[2].helpText"
                        :lastMeasurement="lastMeasurement(parameters[2].name)"
                        v-model="parameters[2].value" 
                    />
                    <AVDN
                        :name="parameters[3].name" 
                        :title="parameters[3].title"
                        :helpText="parameters[3].helpText"
                        :options="parameters[3].options"
                        :lastMeasurement="lastMeasurement(parameters[3].name)"
                        v-model="parameters[3].value"  
                    />
                    <Mucosas
                        :name="parameters[4].name" 
                        :title="parameters[4].title"
                        :helpText="parameters[4].helpText"
                        :options="parameters[4].options"
                        :lastMeasurement="lastMeasurement(parameters[4].name)"
                        v-model="parameters[4].value"  
                    />

                    <Temperature 
                        :name="parameters[5].name" 
                        :title="parameters[5].title"
                        :helpText="parameters[5].helpText"
                        :lastMeasurement="lastMeasurement(parameters[5].name)"
                        v-model="parameters[5].value"  
                    />
                    <Glicemia 
                        :name="parameters[6].name" 
                        :title="parameters[6].title"
                        :helpText="parameters[6].helpText"
                        :lastMeasurement="lastMeasurement(parameters[6].name)"
                        v-model="parameters[6].value"  
                    />
                    <HCT 
                        :name="parameters[7].name" 
                        :title="parameters[7].title"
                        :helpText="parameters[7].helpText"
                        :lastMeasurement="lastMeasurement(parameters[7].name)"
                        v-model="parameters[7].value" 
                    />
                    <BloodPressure 
                        :name="parameters[8].name" 
                        :title="parameters[8].title"
                        :helpText="parameters[8].helpText"
                        :lastMeasurement="lastMeasurement(parameters[8].name)"
                        v-model="parameters[8].value"  
                    />
                    <div class="flex items-center">
                        <input type="checkbox" class="rounded" v-model="createAlert"/>
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