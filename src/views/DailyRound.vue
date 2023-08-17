<script setup lang="ts">
import { ref } from 'vue';

import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue';
import SaveButton from '@/components/Button.vue';
import Parameter from '@/components/ExamParameter.vue';
import ExamTime from '@/components/ExamTime.vue';

import { makeToday, makeHour } from "@/utils/tools"
import { parameters, mucosasOptions, avdnOptions } from '@/data/parameters'
import PATIENTS from '@/data/patients';

const today = makeToday()
const hour = makeHour()
const requiredFields = ref<{}[]>([])
const dailyRound = ref(parameters)
const createAlert = ref<boolean>(false)

function validParameter(fieldName: string){
    const element = document.getElementsByName(fieldName)[0]
    if (element.classList.contains("form-invalid")) element.className = "form-control"
}

function invalidParameter(fieldName: string){
    const element = document.getElementsByName(fieldName)[0]
    element.className = "form-invalid"
}

function validForm(): boolean {
    requiredFields.value = []
    Object.entries(dailyRound.value).forEach(([parameter, value]) => {
        if (!value) {
            requiredFields.value.push({parameter, required: true})
            invalidParameter(parameter)
        } else {
            validParameter(parameter)
        }
        requiredFields.value.filter(item => item === parameter)
    })
    return requiredFields.value.length === 0
}

function sumbitData(patientId: string){
    patientId = "001001:maximus:joao-santos"
    if (validForm()) {
        const data = dailyRound.value
        const patient = PATIENTS.find((patient) => patient.id === patientId)
        patient?.exams.push(data)
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
                <ExamTime :today="today" :hour="hour"/>
                <form action="." class="grid grid-row-1 space-y-4">
                    <Parameter 
                        title="Frequência Cardiaca" 
                        name="heartRate" 
                        helpText="(70 - 120) BPM" 
                        v-model="dailyRound.heartRate"
                    />                    
                    <Parameter 
                        title="Frequência Respiratória" 
                        name="respiratoryRate" 
                        helpText="(10 - 30) RPM" 
                        v-model="dailyRound.respiratoryRate"
                    />
                    <Parameter 
                        title="TRC" 
                        name="trc" 
                        helpText="(> 2')" 
                        v-model="dailyRound.trc"
                    />
                    <Parameter 
                        title="Mucosas" 
                        name="mucosas" :isCombox="true" :options="mucosasOptions" 
                        v-model="dailyRound.mucosas"
                    />
                    <Parameter 
                        title="AVDN" 
                        name="avdn" :isCombox="true" :options="avdnOptions" 
                        v-model="dailyRound.avdn"
                    />
                    <Parameter 
                        title="Temperatura" 
                        name="temperature" 
                        helpText="(37.5 - 39) ºC" 
                        v-model="dailyRound.temperature"
                    />
                    <Parameter 
                        title="Glicemia" 
                        name="glicemia" 
                        helpText="(60 - 100) mg/dl" 
                        v-model="dailyRound.glicemia"
                    />
                    <Parameter 
                        title="Pressão Arteiral (SYS/DIS)" 
                        name="bloodPressure" 
                        helpText="(11/70 - 12/80) mm/Hg" 
                        v-model="dailyRound.bloodPressure"
                    />
                    <Parameter 
                        title="PAM" 
                        name="pam" 
                        helpText="(60)" 
                        v-model="dailyRound.pam"
                    />
                    <div class="flex items-center">
                        <input type="checkbox" name="createAlert" class="rounded" v-model="createAlert">
                        <label for="create-alert" class="ml-2 block text-gray-900">Criar alerta de monitorização</label>
                    </div>
                </form>
            </section>
        </main>
        <Footer>
            <SaveButton class="btn-success" title="Salvar" @click="sumbitData('1000')" />
        </Footer>
    </div>
</template>