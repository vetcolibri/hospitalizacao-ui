<script setup lang="ts">
import Patient from '@/components/patients/Patient.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Today from '@/components/Today.vue'
import { inject, onMounted, ref } from 'vue'

import type { AlertModel } from '@/lib/models/alert'
import type { BudgetModel } from '@/lib/models/budget'
import type { HospitalizationModel } from '@/lib/models/hospitalization'
import type { OwnerModel } from '@/lib/models/owner'
import type { PatientModel } from '@/lib/models/patient'
import { Provided } from '@/lib/provided'
import type { AlertService } from '@/lib/services/alert_service'
import type { BudgetService } from '@/lib/services/budget_service'
import type { HospitalizationService } from '@/lib/services/hospitalization_service'
import type { OwnerService } from '@/lib/services/owner_service'
import type { PatientService } from '@/lib/services/patient_service'
import { useCurrentPatient } from '@/lib/store/patientStore'
import { useRouter } from 'vue-router'

const patients = ref<PatientModel[]>([])
const hospitalizations = ref<HospitalizationModel[]>([])
const owners = ref<OwnerModel[]>([])
const budgets = ref<BudgetModel[]>([])
const alerts = ref<AlertModel[]>([])

const router = useRouter()

const currentPatient = useCurrentPatient()

const patientService = inject<PatientService>(Provided.PatientService)!
const ownerService = inject<OwnerService>(Provided.OwnerService)!
const hospitalizationService = inject<HospitalizationService>(Provided.HospitalizationService)!
const budgetService = inject<BudgetService>(Provided.BudgetService)!
const alertServie = inject<AlertService>(Provided.AlertService)!

function nextPage(patientId: string) {
    currentPatient.$patch({ patientId })
    router.push({ name: 'Measurements' })
}

onMounted(async () => {
    owners.value = await ownerService.getAll()
    patients.value = await patientService.listHospitalized()
    hospitalizations.value = await hospitalizationService.getAllOpened()
    budgets.value = await budgetService.getAll()
    alerts.value = await alertServie.activeAlerts()
})
</script>

<template>
    <Header title="Dashboard" />

    <main class="main-content pb-6">
        <Today class="mt-6" />
        <section class="patients-container">
            <Patient
                v-for="patient in patients"
                :patient="patient"
                :owners="owners"
                :hospitalizations="hospitalizations"
                :budgets="budgets"
                :alerts="alerts"
                @nextPage="nextPage"
            />
        </section>
        <router-link :to="{ name: 'RegisterPatient' }" class="bi bi-plus btn-dashboard">
        </router-link>
    </main>

    <Footer></Footer>
</template>
