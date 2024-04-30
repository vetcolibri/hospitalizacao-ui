<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog.vue'
import BudgetDetails from '@/components/patients/BudgetDetails.vue'
import HospitalizationDetails from '@/components/patients/HospitalizationDetails.vue'
import PatientDetails from './PatientDetails.vue'

import { type BudgetModel } from '@/lib/models/budget'
import type { HospitalizationModel } from '@/lib/models/hospitalization'
import type { OwnerModel } from '@/lib/models/owner'
import type { PatientModel } from '@/lib/models/patient'
import { reactive, ref } from 'vue'

interface Props {
    patient: PatientModel
    owner?: OwnerModel
    hospitalization?: HospitalizationModel
    budget?: BudgetModel
}

interface Emits {
    (e: 'reloadPage'): void
}

defineProps<Props>()
const emits = defineEmits<Emits>()
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

function close() {
    dialogRef.value?.close()

    emits('reloadPage')
}

function open() {
    dialogRef.value?.open()
}

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

        <PatientDetails
            :patient="patient"
            :owner="owner"
            :weight="hospitalization?.weight"
            :active="getTab('1')?.active"
        />

        <HospitalizationDetails
            :hospitalization="hospitalization"
            :active="getTab('2')?.active"
            @close-dialog="close()"
        />
        <BudgetDetails
            :budget="budget"
            :patient-id="patient.systemId"
            :active="getTab('3')?.active"
            @close-dialog="close()"
        />
    </BaseDialog>
</template>
