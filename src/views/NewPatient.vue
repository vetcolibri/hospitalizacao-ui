<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import PatientForm from '@/components/forms/PatientForm.vue'
import HospitalizationForm from '@/components/forms/HospitalizationForm.vue'
import OwnerForm from '@/components/forms/OwnerForm.vue'
import BudgetForm from '@/components/forms/BudgetForm.vue'

import { inject, ref } from 'vue'
import { Provided } from '@/lib/provided'
import type { PatientService } from '@/lib/services/patient_service'

const form = ref<HTMLFormElement>()
const patientData = ref()
const ownerData = ref()
const hospitalizationData = ref()
const budgetData = ref()
const hospitalizationFormRef = ref<typeof HospitalizationForm>()
const ownerFormRef = ref<typeof OwnerForm>()

const patientService = <PatientService>inject(Provided.PatientService)!

async function hospitalize() {
    if (!form.value?.checkValidity()) return form.value?.reportValidity()

    await patientService.newPatient({
        patientData: patientData.value,
        ownerData: ownerData.value,
        hospitalizationData: hospitalizationData.value,
        budgetData: budgetData.value
    })

    hospitalizationFormRef.value?.clear()
    ownerFormRef.value?.clear()

    form.value?.reset()
}
</script>

<template>
    <Header title="Nova hospitalização">
        <GoBack />
    </Header>
    <main class="main-content text-gray-500">
        <form ref="form">
            <section class="container rounded my-4">
                <h1 class="font-medium">Paciente</h1>
                <p class="text-sm text-gray-500">
                    Preencha os campos abaixo com os dados do paciente.
                </p>

                <PatientForm @patient="patientData = $event" />

                <OwnerForm ref="ownerFormRef" @owner="ownerData = $event" />
            </section>

            <HospitalizationForm
                ref="hospitalizationFormRef"
                @hospitalization="hospitalizationData = $event"
            />

            <BudgetForm @budget="budgetData = $event" />
        </form>
    </main>
    <Footer>
        <button class="btn btn-success space-x-2" @click="hospitalize()">
            <i class="bi bi-floppy2"></i>
            <span class="font-medium">Hospitalizar</span>
        </button>
    </Footer>
</template>
