<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import PatientHospitalized from '@/components/Patient.vue'

import { inject, onMounted, ref } from 'vue'
import { Provided } from '@/lib/provided'
import type { Patient } from '@/models/patient'
import type { PatientService } from '@/services/patient_service'

const patients = ref<Patient[]>([])

onMounted(async () => {
    const patientService = inject<PatientService>(Provided.PATIENT_SERVICE)!
    const responseOrErr = await patientService.getAllHospitalized()
    if (responseOrErr.isLeft()) {
        console.error(responseOrErr.value)
        return
    }
    patients.value = responseOrErr.value
})
</script>
<template>
    <div>
        <Header title="Escolha o paciente">
            <GoBack />
        </Header>
        <main class="main-content">
            <section class="py-8 px-12">
                <section class="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:mx-auto xl:max-w-7xl">
                    <PatientHospitalized
                        v-for="patient in patients"
                        :patientId="patient.patientId"
                        :name="patient.name"
                        :specie="patient.specie"
                        :entryDate="patient.entryDate"
                        :hasAlert="patient.hasAlert"
                    />
                </section>
            </section>
        </main>
        <Footer />
    </div>
</template>
