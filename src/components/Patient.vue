<script setup lang="ts">
import PatientDetail from './PatientDetail.vue'

import { ref } from 'vue'
import { iconUrl } from '@/lib/data/patients'
import { makeDateFormat } from '@/lib/shared/utils'
import { usePatientSelectedStore } from '@/store/patientStore'
import { useRoute, useRouter } from 'vue-router'

const date = ref()
const props = defineProps(['patient'])
const patientDetailRef = ref<typeof PatientDetail>()
const patientStore = usePatientSelectedStore()
const router = useRouter()
const route = useRoute()

function openDetails() {
    patientDetailRef.value?.open()
}

function nextPage() {
    patientStore.$patch({ patientId: props.patient.patientId })
    router.push(`/${route.params.page}`)
}

date.value = makeDateFormat(new Date(props.patient.hospitalization.entryDate))
</script>
<template>
    <section
        class="bg-white p-3.5 rounded shadow-sm border space-y-4"
        :class="patient.hasAlert ? 'border-yellow-500' : 'border-gray-100'"
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
        </div>
        <div class="flex justify-between items-center">
            <button class="btn btn-success text-sm" @click="nextPage()">Avançar</button>
            <i
                v-if="patient.hasAlert"
                class="bi bi-exclamation-triangle-fill text-base md:text-lg text-yellow-500"
            >
            </i>
        </div>
    </section>
    <PatientDetail ref="patientDetailRef" :patient="patient" />
</template>
