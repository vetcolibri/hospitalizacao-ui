<script setup lang="ts">
import PatientDetail from './PatientDetail.vue'

import { ref } from 'vue'
import { iconUrl } from '@/lib/data/patients'
import { makeDateFormat } from '@/lib/shared/utils'

const date = ref()
const props = defineProps(['patient'])
const patientDetailRef = ref<typeof PatientDetail>()

function openDetails() {
    patientDetailRef.value?.open()
}

date.value = makeDateFormat(new Date(props.patient.entryDate!))
</script>
<template>
    <section
        class="bg-white p-3.5 rounded shadow-sm border border-gray-100 space-y-4 cursor-pointer"
    >
        <div class="flex gap-2 border-b pb-1">
            <div class="flex flex-1 gap-2 items-center">
                <img class="w-4 h-4 md:w-8 md:h-8" :src="iconUrl" alt="patient-icon" />
                <h5 class="flex-1 font-medium">{{ patient.name }}</h5>
            </div>
            <i
                class="bi bi-info-circle-fill text-blue-500 cursor-pointer z-[1000]"
                @click="openDetails()"
            ></i>
        </div>
        <div class="flex gap-4 mt-4">
            <ul class="patient-info">
                <li class="patient-info-item">
                    <span>ID Paciente</span>
                    <span class="patient-info-text">{{ patient.patientId }}</span>
                </li>
                <li class="patient-info-item">
                    <span>Espécie </span>
                    <span class="patient-info-text">{{ patient.specie }}</span>
                </li>
                <li class="patient-info-item">
                    <span>Data de entrada </span>
                    <span class="patient-info-text">{{ date }}</span>
                </li>
            </ul>
            <PatientDetail ref="patientDetailRef" :patient="patient" />
        </div>
    </section>
</template>

<!-- <router-link :to="`/${$route.params.page}/${patient.patientId}`">
</router-link> -->
