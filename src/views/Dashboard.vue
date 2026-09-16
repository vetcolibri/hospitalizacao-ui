<script setup lang="ts">
import PatientHospitalized from '@/components/patients/PatientHospitalized.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Today from '@/components/Today.vue'
import { onMounted, toValue } from 'vue'

import { useCurrentPatient } from '@/lib/store/patientStore'
import type { ContactModel } from '@/lib/models/contact'
import { useRouter } from 'vue-router'
import { usePageData } from '@/composables/usePageData'

const router = useRouter()
const pageData = usePageData()
const currentPatient = useCurrentPatient()

function nextPage(patientId: string, ownerId?: string, contact?: ContactModel) {
    currentPatient.$patch({ patientId, ownerId, contact })
    router.push({ name: 'Measurements' })
}

onMounted(async () => await pageData.loadData())
</script>

<template>
    <Header title="Dashboard" />

    <main class="main-content pb-6">
        <Today class="mt-6" />
        <div class="mt-4 flex flex-wrap justify-end gap-2 xl:mx-auto xl:max-w-7xl">
            <router-link
                :to="{ name: 'RecentHospitalizations' }"
                class="btn btn-secondary inline-flex items-center gap-2"
            >
                <i class="bi bi-clock-history"></i>
                <span>Últimos internamentos</span>
            </router-link>
            <router-link
                :to="{ name: 'PatientHistory' }"
                class="btn btn-secondary inline-flex items-center gap-2"
            >
                <i class="bi bi-search"></i>
                <span>Consultar histórico</span>
            </router-link>
        </div>
        <section class="patients-container">
            <PatientHospitalized
                v-for="patient in toValue(pageData.patients)"
                :key="patient.patientId"
                :patient="patient"
                :owners="toValue(pageData.owners)"
                :hospitalizations="toValue(pageData.hospitalizations)"
                :budgets="toValue(pageData.budgets)"
                :alerts="toValue(pageData.alerts)"
                @nextPage="nextPage"
                @reloadPage="pageData.loadData()"
            />
        </section>
        <router-link :to="{ name: 'RegisterPatient' }" class="bi bi-plus btn-dashboard" />
    </main>

    <Footer />
</template>
