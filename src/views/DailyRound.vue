<script setup lang="ts">
import { inject, onMounted, reactive, readonly, ref } from 'vue'

import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import SaveButton from '@/components/Button.vue'
import Parameter from '@/components/ExamParameter.vue'
import ExamTime from '@/components/ExamTime.vue'

import { makeToday, makeHour } from '@/utils/tools'
import { parameters } from '@/data/parameters'
import PATIENTS from '@/data/patients'

const today = makeToday()
const hour = makeHour()
const dailyRound = reactive(parameters)
const createAlert = ref<boolean>(false)

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
    Object.values(dailyRound).forEach((parameter) => {
        if (parameter.value) {
            count++
            removeInvalidClass(parameter.name)
        } else {
            addInvalidClass(parameter.name)
        }
    })
    return count === dailyRound.length
}

function sumbitData(patientId: string) {
    if (validForm()) {
        const data = dailyRound
        const patient = PATIENTS.find((patient) => patient.id === patientId)
        // patient?.exams.push(data)
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
                @click="sumbitData(`${$route.params.patientId}`)"
            />
        </Footer>
    </div>
</template>
