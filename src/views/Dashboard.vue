<script setup lang="ts">
import DashboardMenu from '@/components/DashboardMenu.vue'
import ChoosePatient from '@/components/ChoosePatient.vue'
import Header from '@/components/Header.vue'

import type { IPatientService } from '@/lib/services/patient_service'
import type { Patient } from '@/lib/models/patient'
import { inject, onMounted, ref } from 'vue'
import { Provided } from '@/lib/provided'
import { makeDateFormat } from '@/lib/shared/utils'

const patients = ref<Patient[]>([])
const patientService = inject<IPatientService>(Provided.PatientService)!
const today = new Date()

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
        <div class="my-8 text-right text-sm sm:text-base">
            <span class="btn btn-secondary rounded-md shadow-sm">{{ makeDateFormat(today) }}</span>
        </div>
        <ChoosePatient :patients="patients" />
    </main>

    <DashboardMenu />
</template>
