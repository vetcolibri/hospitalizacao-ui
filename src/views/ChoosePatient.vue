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
    const responseOrError = await patientService.getAllHospitalized()
    if (responseOrError.isLeft()) {
        console.error(responseOrError.value)
        return
    }
    patients.value = responseOrError.value
})
</script>
<template>
    <div>
        <Header title="Escolha o paciente">
            <GoBack />
        </Header>
        <main class="main-content">
            <section class="py-8 px-12">
                <section
                    class="grid grid-cols-1 md:grid-cols-2 gap-4 xl:grid-cols-3 mx-auto xl:max-w-7xl"
                >
                    <PatientHospitalized v-for="patient in patients" :patient="patient" />
                </section>
            </section>
        </main>
        <Footer></Footer>
    </div>
</template>
