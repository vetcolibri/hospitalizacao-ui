<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog.vue'
import { ref } from 'vue'

import { BudgetStatus, type BudgetModel } from '@/lib/models/budget'
import type { HospitalizationModel } from '@/lib/models/hospitalization'
import type { OwnerModel } from '@/lib/models/owner'
import type { PatientModel } from '@/lib/models/patient'
import { formatDate } from '@/lib/shared/format_date'

interface Props {
    patient: PatientModel
    owner?: OwnerModel
    hospitalization?: HospitalizationModel
    budget?: BudgetModel
}

const patientTab = ref<boolean>(true)
const hospitalizationTab = ref<boolean>(false)
const dialogRef = ref<typeof BaseDialog>()

function chooseColor(value?: string) {
    if (!value) return

    if (BudgetStatus.Paid === value) {
        return { 'badge-success': true }
    }

    if (BudgetStatus.Pending === value || BudgetStatus.PendingWithBudgetSent === value) {
        return { 'badge-warning': true }
    }

    if (BudgetStatus.Unpaid === value) {
        return { 'badge-danger': true }
    }

    return
}

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

defineProps<Props>()
defineExpose({ open })
</script>
<template>
    <BaseDialog ref="dialogRef" :title="patient.name">
        <div class="border-b border-gray-200 mb-3">
            <ul class="flex flex-wrap font-medium text-center text-gray-500">
                <li class="mr-2" @click="showPatientTab()">
                    <span class="tab" :class="{ 'text-blue-500': patientTab }"> Paciente </span>
                </li>
                <li class="mr-2" @click="showHospitalizationTab()">
                    <span class="tab" :class="{ 'text-blue-500': hospitalizationTab }">
                        Hospitalização
                    </span>
                </li>
            </ul>
        </div>
        <ul v-show="patientTab" class="patient-info">
            <li class="patient-info-item">
                <span>Idade</span>
                <span class="patient-info-text">{{ patient.birthDate }}</span>
            </li>
            <li class="patient-info-item">
                <span>Raça</span>
                <span class="patient-info-text">{{ patient.breed }}</span>
            </li>
            <li class="patient-info-item">
                <span>ID Proprietário </span>
                <span class="patient-info-text">{{ owner?.ownerId }}</span>
            </li>
            <li class="patient-info-item">
                <span>Proprietário </span>
                <span class="patient-info-text">{{ owner?.name }}</span>
            </li>
            <li class="patient-info-item">
                <span>Telemóvel </span>
                <span class="patient-info-text">{{ owner?.phoneNumber }}</span>
            </li>
        </ul>
        <div v-show="hospitalizationTab" class="space-y-3">
            <ul class="patient-info">
                <li class="patient-info-item">
                    <span>Peso (Kg)</span>
                    <span class="patient-info-text">{{ hospitalization?.weight }}</span>
                </li>
                <li class="patient-info-item flex-col">
                    <span>Queixas</span>
                    <div class="mt-1 space-x-2 space-y-2">
                        <span
                            class="badge badge-dark"
                            v-for="complaint in hospitalization?.complaints"
                        >
                            {{ complaint }}
                        </span>
                    </div>
                </li>
                <li class="patient-info-item flex-col">
                    <span>Diagnosticos</span>
                    <div class="mt-1 space-x-2 space-y-2">
                        <span
                            class="badge badge-dark"
                            v-for="diagnostic in hospitalization?.diagnostics"
                        >
                            {{ diagnostic }}
                        </span>
                    </div>
                </li>
                <li class="patient-info-item">
                    <span>Alta prevista</span>
                    <span class="patient-info-text">
                        {{ formatDate(hospitalization?.dischargeDate) }}
                    </span>
                </li>
            </ul>
            <div class="space-y-2">
                <h1>Orçamento</h1>
                <ul class="patient-info">
                    <li class="patient-info-item">
                        <span>Iniciou em</span>
                        <span class="patient-info-text">
                            <span class="patient-info-text">{{ formatDate(budget?.startOn) }}</span>
                        </span>
                    </li>
                    <li class="patient-info-item">
                        <span>Termina em</span>
                        <span class="patient-info-text">{{ formatDate(budget?.endOn) }}</span>
                    </li>
                    <li class="patient-info-item items-center">
                        <span>Estado</span>
                        <span class="badge" :class="chooseColor(budget?.status)">
                            {{ budget?.status }}
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </BaseDialog>
</template>
