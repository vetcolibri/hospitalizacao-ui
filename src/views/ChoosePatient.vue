<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import PatientHospitalized from '@/components/Patient.vue'

import { inject, onMounted, ref } from 'vue'

import type { IPatientService } from '@/lib/services/patient_service'
import type { Patient } from '@/lib/models/patient'
import { Provided } from '@/lib/provided'

const patients = ref<Patient[]>([])
const patientService = inject<IPatientService>(Provided.PatientService)!

onMounted(async () => {
    const patientsOrError = await patientService.getAllHospitalized()
    if (patientsOrError.isLeft()) {
        alert('Não foi possível carregar os pacientes')
        return
    }

    patients.value = patientsOrError.value
})
</script>
<template>
    <div>
        <Header title="Escolha o paciente">
            <GoBack />
        </Header>
        <main class="main-content">
            <section class="container-patients">
                <PatientHospitalized v-for="patient in patients" :patient="patient" />
            </section>
        </main>
        <Footer></Footer>
    </div>
</template>
