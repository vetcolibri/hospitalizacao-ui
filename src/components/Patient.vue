<script setup lang="ts">
import PatientDetails from './PatientDetails.vue'

import { ref } from 'vue'
import { iconUrl } from '@/lib/data/patients'
import { makeDateFormat } from '@/lib/shared/utils'
import { usePatientSelectedStore } from '@/lib/store/patientStore'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps(['patient'])
const patientDetailsRef = ref<typeof PatientDetails>()
const patientStore = usePatientSelectedStore()
const entryDate = new Date(props.patient.hospitalization.entryDate)
const router = useRouter()
const route = useRoute()

function openDetails() {
    patientDetailsRef.value?.open()
}

function nextPage() {
    patientStore.$patch({ patientId: props.patient.systemId })
    router.push({ name: 'Measurements' })
}
</script>
<template>
    <section
        class="bg-white p-3.5 rounded shadow-sm border space-y-4"
        :class="patient.hasAlert ? 'border-yellow-500' : 'border-gray-300'"
    >
        <div class="flex gap-2 border-b pb-1">
            <div class="flex flex-1 gap-2 items-center">
                <img class="w-4 h-4 md:w-8 md:h-8" :src="iconUrl" alt="patient-icon" />
                <h5 class="flex-1 font-medium">{{ patient.name }}</h5>
            </div>
            <i
                class="bi bi-info-circle-fill text-blue-500 float-right inline cursor-pointer z-[1000]"
                @click="openDetails()"
            ></i>
        </div>
        <div class="flex flex-col justify-center cursor-pointer gap-1 mt-4" @click="nextPage()">
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
                    <span class="patient-info-text">{{ makeDateFormat(new Date(entryDate)) }}</span>
                </li>
            </ul>
            <i
                v-if="patient.hasAlert"
                class="bi bi-exclamation-triangle-fill text-base text-yellow-500"
            >
            </i>
        </div>
    </section>
    <PatientDetails ref="patientDetailsRef" :patient="patient" />
</template>
