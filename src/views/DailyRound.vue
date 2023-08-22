<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import SaveButton from '@/components/Button.vue'
import Parameter from '@/components/ExamParameter.vue'
import ExamTime from '@/components/ExamTime.vue'

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
            hour,
            date: today
        }
        patient?.measurements.push(data)
    }
    cleanUpForm()
    alert("Medições da ronda diária salvas com sucesso.")
    console.log(patient?.measurements)
}


function lastMeasurement(parameter: string) {
    const patient = PATIENTS.find((patient) => patient.id === patientId)
    if (!patient) return
    const measurements = patient.measurements.filter((item) => item.parameter === parameter)
    const measurement = measurements[measurements.length - 1]
    return measurement
}

function save(){
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
                    <Parameter
                        v-for="parameter in parameters"
                        :name="parameter.name"
                        :title="parameter.title"
                        :isCombox="parameter.isCombox"
                        :helpText="parameter.helpText"
                        :options="parameter.options"
                        v-model="parameter.value"
                        :lastMeasurement="lastMeasurement(parameter.name)"
                    />
                    <div class="flex items-center">
                        <input
                            type="checkbox"
                            name="createAlert"
                            class="rounded"
                            v-model="createAlert"
                        />
                        <label for="create-alert" class="ml-2 block text-gray-900">
                            Criar alerta de monitorização
                        </label>
                    </div>
                </form>
            </section>
        </main>
        <Footer>
            <SaveButton
                class="btn-success"
                title="Salvar"
                @click="save"
            />
        </Footer>
    </div>
</template>
