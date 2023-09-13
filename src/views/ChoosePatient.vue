<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import PatientHospitalized from '@/components/Patient.vue'

import { inject, onMounted, ref } from 'vue'
import type { Patient } from '@/lib/types'
import type { PatientAPI } from '@/lib/apiClient/patients'

const patients = ref<Patient[]>([])

onMounted(async () => {
    const patientClient = inject('patientClient') as PatientAPI
    const data = await patientClient.getAllHospitalized()
    patients.value = data
})
</script>
<template>
    <div>
        <Header title="Escolha o paciente">
            <GoBack />
        </Header>
        <main class="main-content py-8">
            <section>
                <PatientHospitalized
                    v-for="patient in patients"
                    :patientId="patient.patientId"
                    :name="patient.name"
                    :specie="patient.specie"
                    :hasAlert="patient.hasAlert"
                    class="xl:w-[600px]"
                />
            </section>
        </main>
        <Footer />
    </div>
</template>
