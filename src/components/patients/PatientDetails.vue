<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog.vue'

import { BudgetStatus, type BudgetModel } from '@/lib/models/budget'
import type { HospitalizationModel } from '@/lib/models/hospitalization'
import type { OwnerModel } from '@/lib/models/owner'
import type { PatientModel } from '@/lib/models/patient'
import { formatDate } from '@/lib/shared/format_date'
import { reactive, ref } from 'vue'

interface Props {
    patient: PatientModel
    owner?: OwnerModel
    hospitalization?: HospitalizationModel
    budget?: BudgetModel
}
const dialogRef = ref<typeof BaseDialog>()
const tabs = reactive([
    { id: '1', name: 'Paciente', active: true },
    { id: '2', name: 'Hospitalização', active: false },
    { id: '3', name: 'Orçamento', active: false }
])

function showTab(id: string) {
    tabs.forEach((tab) => (tab.active = tab.id === id))
}

function getTab(id: string) {
    return tabs.find((tab) => tab.id === id)
}

function budgetStatusColor(value?: string) {
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

function open() {
    dialogRef.value?.open()
}

defineProps<Props>()
defineExpose({ open })
</script>
<template>
    <BaseDialog ref="dialogRef" title="Resumo">
        <div class="border-b border-gray-200 mb-3">
            <ul class="flex flex-wrap gap-2 font-medium text-center text-gray-500">
                <li
                    class="tab"
                    v-for="tab in tabs"
                    :class="{ 'text-blue-500': tab.active }"
                    @click="showTab(tab.id)"
                >
                    {{ tab.name }}
                </li>
            </ul>
        </div>
        <ul v-show="getTab('1')?.active" class="patient-info">
            <li class="patient-info-item">
                <span>ID Paciente</span>
                <span class="patient-info-text">{{ patient.patientId }}</span>
            </li>
            <li class="patient-info-item">
                <span>Nome</span>
                <span class="patient-info-text">{{ patient.name }}</span>
            </li>
            <li class="patient-info-item">
                <span>Idade</span>
                <span class="patient-info-text">{{ patient.birthDate }}</span>
            </li>
            <li class="patient-info-item">
                <span>Peso (Kg)</span>
                <span class="patient-info-text">{{ hospitalization?.weight }}</span>
            </li>
            <li class="patient-info-item">
                <span>Espécie</span>
                <span class="patient-info-text">{{ patient.specie }}</span>
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

        <div v-show="getTab('2')?.active" class="space-y-3">
            <ul class="patient-info">
                <li class="patient-info-item flex-col">
                    <span>Queixas</span>
                    <div class="mt-1 space-x-2 space-y-2">
                        <span
                            v-for="complaint in hospitalization?.complaints"
                            class="badge badge-dark"
                        >
                            {{ complaint }}
                        </span>
                    </div>
                </li>
                <li class="patient-info-item flex-col">
                    <span>Diagnosticos</span>
                    <div class="mt-1 space-x-2 space-y-2">
                        <span
                            v-for="diagnostic in hospitalization?.diagnostics"
                            class="badge badge-dark"
                        >
                            {{ diagnostic }}
                        </span>
                    </div>
                </li>
                <li class="patient-info-item">
                    <span>Data de entrada</span>
                    <span class="patient-info-text">
                        {{ formatDate(hospitalization?.entryDate) }}
                    </span>
                </li>
                <li class="patient-info-item">
                    <span>Alta prevista</span>
                    <span class="patient-info-text">
                        {{ formatDate(hospitalization?.dischargeDate) }}
                    </span>
                </li>
            </ul>
        </div>

        <div v-show="getTab('3')?.active" class="space-y-3">
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
                    <span :class="budgetStatusColor(budget?.status)">
                        {{ budget?.status }}
                    </span>
                </li>
            </ul>
        </div>
    </BaseDialog>
</template>
