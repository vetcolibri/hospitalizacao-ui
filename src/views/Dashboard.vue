<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ChoosePatient from './ChoosePatient.vue'

import type { IPatientService } from '@/lib/services/patient_service'
import type { Patient } from '@/lib/models/patient'
import { inject, onMounted, ref } from 'vue'
import { Provided } from '@/lib/provided'

const patients = ref<Patient[]>([])
const patientService = inject<IPatientService>(Provided.PatientService)!

onMounted(async () => {
    const patientsOrErr = await patientService.getAllHospitalized()
    if (patientsOrErr.isLeft()) {
        alert('Não foi possível carregar os pacientes')
        return
    }

    patients.value = patientsOrErr.value
})
</script>

<template>
    <Header title="Dashboard" />

    <main class="main-content">
        <ChoosePatient :patients="patients" />
    </main>

    <Footer />
</template>

<!-- <main class="main-content">
        <nav class="flex items-center justify-center h-full">
            <ul class="flex flex-col gap-4 w-full lg:max-w-lg xl:max-w-xl">
                <router-link :to="{ name: 'Hospitalization' }">
                    <li class="menu-item">
                        <i class="bi bi-hospital-fill icon"></i>
                        <span>Nova Hospitalização</span>
                    </li>
                </router-link>
                <router-link :to="{ name: 'ExamGeneralCondition' }">
                    <li class="menu-item">
                        <i class="bi bi-clipboard2-data-fill icon"></i>
                        <span>Exame Estado Geral</span>
                    </li>
                </router-link>
            </ul>
        </nav>
    </main> -->
