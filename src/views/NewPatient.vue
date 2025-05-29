<script setup lang="ts">
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import GoBack from '@/components/GoBack.vue';
import PatientForm from '@/components/forms/PatientForm.vue';
import HospitalizationForm from '@/components/forms/HospitalizationForm.vue';
import OwnerForm from '@/components/forms/OwnerForm.vue';
import BudgetForm from '@/components/forms/BudgetForm.vue';

import { inject, onMounted, onUnmounted, ref } from 'vue';
import { Provided } from '@/lib/provided';
import type { NewPatientData, PatientService } from '@/lib/services/patient_service';
import type { PatientModel } from '@/lib/models/patient';

const patientService = <PatientService>inject(Provided.PatientService)!;

const form = ref<HTMLFormElement>();
const patientData = ref<Partial<PatientModel>>({});
const ownerData = ref();
const hospitalizationData = ref();
const budgetData = ref();
const hospitalizationFormRef = ref<typeof HospitalizationForm>();
const ownerFormRef = ref<typeof OwnerForm>();

const wakeLock = ref<WakeLockSentinel | undefined>();

async function hospitalize() {
    if (!form.value?.checkValidity()) return form.value?.reportValidity();

    await patientService.newPatient({
        patientData: patientData.value as PatientModel,
        ownerData: ownerData.value,
        hospitalizationData: hospitalizationData.value,
        budgetData: budgetData.value
    });

    hospitalizationFormRef.value?.clear();
    ownerFormRef.value?.clear();

    form.value?.reset();
}

function checkPatient(patient: Partial<PatientModel & { exists: boolean }>) {
    patientData.value.patientId = patient.patientId;
    patientData.value.name = patient.name;
    patientData.value.specie = patient.specie;
    patientData.value.breed = patient.breed;
    patientData.value.birthDate = patient.birthDate;

    if (patient.exists) {
        console.log('Trying to find owner');
        ownerFormRef.value?.findOwner(patient.ownerId);
    }
}

onMounted(async () => {
    if ('wakeLock' in navigator) {
        console.log('Screen Wake Lock API suportada!');
    } else {
        console.log('Screen Wake Lock API não suportada.');
        return;
    }

    try {
        wakeLock.value = await navigator.wakeLock.request('screen');
        console.log('Tela bloqueada com sucesso!');
    } catch (err) {
        console.error('Falha ao bloquear a tela:', err);
    }
});

onUnmounted(async () => {
    await wakeLock.value?.release();
    console.log('Tela desbloqueada com sucesso!');
});
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

                <PatientForm @patient="checkPatient($event)" />

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
