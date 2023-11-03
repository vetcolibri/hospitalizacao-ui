<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog.vue'

import { ref } from 'vue'

const patientTab = ref(true)
const hospitalizationTab = ref(false)
const dialogRef = ref<typeof BaseDialog>()

function showPatientTab() {
    patientTab.value = true
    hospitalizationTab.value = false
}

function showHospitalizationTab() {
    patientTab.value = false
    hospitalizationTab.value = true
}

function open() {
    dialogRef.value?.open()
}

defineProps(['patient'])
defineExpose({ open })
</script>
<template>
    <BaseDialog ref="dialogRef" :title="patient.name">
        <div class="border-b border-gray-200 mb-3">
            <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500">
                <li class="mr-2" @click="showPatientTab()">
                    <span
                        class="inline-flex p-2 border border-transparent rounded-t-lg hover:text-blue-600 hover:border-blue-300 group"
                        :class="{ 'text-blue-500': patientTab }"
                    >
                        Paciente
                    </span>
                </li>
                <li class="mr-2" @click="showHospitalizationTab()">
                    <span
                        class="inline-flex p-2 border border-transparent rounded-t-lg hover:text-blue-600 hover:border-blue-300 group"
                        :class="{ 'text-blue-500': hospitalizationTab }"
                    >
                        Hospitalização
                    </span>
                </li>
            </ul>
        </div>
        <ul v-show="patientTab" class="patient-info">
            <li class="patient-info-item">
                <span>Raça</span>
                <span class="patient-info-text">{{ patient.breed }}</span>
            </li>
            <li class="patient-info-item">
                <span>ID Proprietário </span>
                <span class="patient-info-text">{{ patient.ownerId }}</span>
            </li>
            <li class="patient-info-item">
                <span>Proprietário </span>
                <span class="patient-info-text">{{ patient.ownerName }}</span>
            </li>
            <li class="patient-info-item">
                <span>Telemóvel </span>
                <span class="patient-info-text">{{ patient.ownerPhoneNumber }}</span>
            </li>
        </ul>
        <div v-show="hospitalizationTab" class="space-y-3">
            <ul class="patient-info">
                <li class="patient-info-item">
                    <span>Idade</span>
                    <span class="patient-info-text">2 anos e 3 meses</span>
                </li>
                <li class="patient-info-item">
                    <span>Peso (Kg)</span>
                    <span class="patient-info-text">15.7</span>
                </li>
                <li class="patient-info-item">
                    <span>Queixas</span>
                    <span class="patient-info-text">Anorexia</span>
                </li>
                <li class="patient-info-item">
                    <span>Diagnosticos</span>
                    <span class="patient-info-text">Gripe</span>
                </li>
                <li class="patient-info-item">
                    <span>Alta prevista</span>
                    <span class="patient-info-text">2 dias</span>
                </li>
            </ul>
            <div class="space-y-2">
                <h1>Orçamento</h1>
                <ul class="patient-info">
                    <li class="patient-info-item">
                        <span>Iniciou em</span>
                        <span class="patient-info-text">13 Mar. 2023</span>
                    </li>
                    <li class="patient-info-item">
                        <span>Termina em</span>
                        <span class="patient-info-text">17 Mar. 2023</span>
                    </li>
                    <li class="patient-info-item items-center">
                        <span>Estado</span>
                        <div class="badge badge-success">
                            <i class="bi bi-check-circle-fill mr-1"></i>
                            <span>Pago</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </BaseDialog>
</template>
