<script setup lang="ts">
import BaseInput from '@/components/BaseInput.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import Header from '@/components/Header.vue'
import HospitalizationHistory from '@/components/patients/HospitalizationHistory.vue'
import type { PatientModel } from '@/lib/models/patient'
import { Provided } from '@/lib/provided'
import type { PatientService } from '@/lib/services/patient_service'
import { inject, ref } from 'vue'

/**
 * RF-15 — acesso autenticado ao histórico por ID, para QUALQUER estado.
 *
 * Depois da alta o paciente desaparece do dashboard de hospitalizados; esta
 * pesquisa directa permite abrir o histórico em leitura sem criar uma nova
 * hospitalização.
 */
const patientService = inject<PatientService>(Provided.PatientService)!

const searchId = ref('')
const searching = ref(false)
const error = ref('')
const patient = ref<PatientModel>()

async function search() {
    const patientId = searchId.value.trim()

    if (!patientId || searching.value) return

    searching.value = true
    error.value = ''

    const result = await patientService.searchPatient(patientId)

    searching.value = false

    if (result.isLeft() || !result.value) {
        patient.value = undefined
        error.value = 'Paciente não encontrado'
        return
    }

    patient.value = result.value
}
</script>

<template>
    <Header title="Consultar histórico">
        <GoBack />
    </Header>

    <main class="main-content text-gray-500">
        <section class="container my-4">
            <h1 class="font-medium text-gray-900">Consultar histórico de paciente</h1>
            <p class="text-sm text-gray-500">
                Pesquise pelo ID da clínica. Funciona para pacientes internados e já com alta,
                sem criar nova hospitalização.
            </p>

            <div class="form-container items-end">
                <BaseInput
                    class="flex-1"
                    placeholder="ID do Paciente"
                    v-model="searchId"
                    @keydown.enter.prevent="search()"
                />
                <button type="button" class="btn btn-secondary" @click="search()">
                    Pesquisar
                </button>
            </div>

            <p v-if="searching" class="text-sm text-gray-500">A procurar…</p>
            <p v-if="error" class="text-sm text-red-600" role="alert">{{ error }}</p>
        </section>

        <section v-if="patient" class="container my-4">
            <ul class="patient-info">
                <li class="patient-info-item">
                    <span>ID Paciente</span>
                    <span class="patient-info-text">{{ patient.patientId }}</span>
                </li>
                <li class="patient-info-item">
                    <span>Nome</span>
                    <span class="patient-info-text">{{ patient.name }}</span>
                </li>
                <li class="patient-info-item">
                    <span>Espécie</span>
                    <span class="patient-info-text">{{ patient.specie }}</span>
                </li>
                <li class="patient-info-item">
                    <span>Raça</span>
                    <span class="patient-info-text">{{ patient.breed }}</span>
                </li>
                <li class="patient-info-item">
                    <span>Estado</span>
                    <span class="patient-info-text">{{ patient.status }}</span>
                </li>
            </ul>

            <HospitalizationHistory :patient-id="patient.systemId" :active="true" />
        </section>
    </main>

    <Footer />
</template>
