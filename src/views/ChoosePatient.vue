<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import PatientHospitalized from '@/components/Patient.vue'

import { inject, onMounted, ref } from 'vue'
import { Provided } from '@/lib/provided'
import type { Patient } from '@/models/patient'
import type { IPatientService } from '@/services/patient_service'

const patients = ref<Patient[]>([])
const patientService = inject<IPatientService>(Provided.PATIENT_SERVICE)!

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
        <main class="main-content my-8">
            <section
                class="grid grid-cols-1 md:grid-cols-2 gap-4 xl:grid-cols-3 mx-auto xl:max-w-7xl"
            >
                <PatientHospitalized v-for="patient in patients" :patient="patient" />
            </section>
        </main>
        <Footer></Footer>
    </div>
</template>
