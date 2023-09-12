<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import PatientHospitalized from '@/components/Patient.vue'
import type { Patient } from '@/lib/types'
import { ref } from 'vue'

const patients = ref<Patient[]>([])
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
