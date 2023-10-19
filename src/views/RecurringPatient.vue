<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Search from '@/components/hospitalization/InputField.vue'
import GoBack from '@/components/GoBack.vue'
import { inject, ref } from 'vue'
import { Provided } from '@/lib/provided'
import { PatientService } from '@/services/patient_service'
import { Patient } from '@/models/patient'
import HospitalizationForm from '@/components/HospitalizationForm.vue'

const patientService = <PatientService>inject(Provided.PATIENT_SERVICE)!
const patient = ref<Patient>()
const message = ref<string>('')
const patientId = ref<string>('')

function isEmpty() {
    return !patient.value
}

function showMessage(text: string) {
    message.value = text
}

async function findPatient() {
    if (patientId.value === '') {
        showMessage('Preencha o campo de busca.')
        return
    }
    const patientOrError = await patientService.findPatientById(patientId.value)
    if (patientOrError.isLeft() && patientOrError.value.status === 404) {
        showMessage(`Paciente com ID ${patientId.value} não foi encontrado.`)
        return
    }
    patient.value = <Patient>patientOrError.value
}
</script>
<template>
    <Header title="Nova Hospitalização">
        <GoBack />
    </Header>
    <main v-if="isEmpty()" class="main-content flex flex-col justify-center px-12">
        <section class="container">
            <p class="text-gray-600">
                Encontre o <strong>Paciente</strong> pelo seu ID para ser hospitalizado.
            </p>
            <div class="flex items-center gap-3">
                <Search
                    placeholder="Digite o ID do Paciente"
                    class="w-full mt-0"
                    v-model="patientId"
                />
                <button type="button" @click="findPatient()">
                    <i class="bi bi-search text-base md:text-2xl text-yellow-500"></i>
                </button>
            </div>
            <p class="text-xs text-red-500">{{ message }}</p>
        </section>
    </main>
    <main v-else class="main-content">
        <section class="px-12 my-8">
            <section class="container">
                <HospitalizationForm
                    :patient-id="patient!.patientId"
                    :name="patient!.name"
                    :specie="patient!.specie"
                />
            </section>
        </section>
    </main>
    <Footer></Footer>
</template>
