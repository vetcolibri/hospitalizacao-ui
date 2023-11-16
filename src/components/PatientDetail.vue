<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog.vue'
import { makeDateFormat } from '@/lib/shared/utils'
import { Patient } from '@/models/patient'

import { ref } from 'vue'

const patientTab = ref(true)
const hospitalizationTab = ref(false)
const dialogRef = ref<typeof BaseDialog>()
const props = defineProps(['patient'])
const hospitalization = props.patient.hospitalization
const budget = hospitalization.budget

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
                    <span class="patient-info-text">{{ patient.birthDate }}</span>
                </li>
                <li class="patient-info-item">
                    <span>Peso (Kg)</span>
                    <span class="patient-info-text">{{ hospitalization.weight }}</span>
                </li>
                <li class="patient-info-item flex-col">
                    <span>Queixas</span>
                    <div class="mt-1 space-x-2">
                        <span
                            class="badge badge-dark space-x-1"
                            v-for="complaint in hospitalization.complaints"
                        >
                            {{ complaint }}
                        </span>
                    </div>
                </li>
                <li class="patient-info-item flex-col">
                    <span>Diagnosticos</span>
                    <div class="mt-1 space-x-2">
                        <span
                            class="badge badge-dark space-x-1"
                            v-for="diagnostic in hospitalization.diagnostics"
                        >
                            {{ diagnostic }}
                        </span>
                    </div>
                </li>
                <li class="patient-info-item">
                    <span>Alta prevista</span>
                    <span class="patient-info-text">{{
                        makeDateFormat(new Date(hospitalization.dischargeDate))
                    }}</span>
                </li>
            </ul>
            <div class="space-y-2">
                <h1>Orçamento</h1>
                <ul class="patient-info">
                    <li class="patient-info-item">
                        <span>Iniciou em</span>
                        <span class="patient-info-text">
                            {{ makeDateFormat(new Date(budget.startOn)) }}
                        </span>
                    </li>
                    <li class="patient-info-item">
                        <span>Termina em</span>
                        <span class="patient-info-text">
                            {{ makeDateFormat(new Date(budget.endOn)) }}
                        </span>
                    </li>
                    <li class="patient-info-item items-center">
                        <span>Estado</span>

                        <div v-if="budget.status === 'PAGO'" class="badge badge-success">
                            <i class="bi bi-check-circle-fill mr-1"></i>
                            <span>{{ budget.status }}</span>
                        </div>

                        <div v-if="budget.status === 'PENDENTE'" class="badge badge-warning">
                            <i class="bi bi-exclamation-triangle-fill mr-1"></i>
                            <span>{{ budget.status }}</span>
                        </div>

                        <div v-if="budget.status === 'NÃO PAGO'" class="badge badge-danger">
                            <i class="bi bi-x-circle-fill mr-1"></i>
                            <span>{{ budget.status }}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </BaseDialog>
</template>
