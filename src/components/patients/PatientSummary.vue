<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog.vue'
import BudgetDetails from '@/components/patients/BudgetDetails.vue'
import HospitalizationDetails from '@/components/patients/HospitalizationDetails.vue'
import HospitalizationHistory from '@/components/patients/HospitalizationHistory.vue'
import PatientDetails from './PatientDetails.vue'

import { type BudgetModel } from '@/lib/models/budget'
import type { HospitalizationModel } from '@/lib/models/hospitalization'
import type { ContactModel } from '@/lib/models/contact'
import type { OwnerModel } from '@/lib/models/owner'
import type { PatientModel } from '@/lib/models/patient'
import { resolveEffectiveContact } from '@/lib/domain/effective_contact'
import { computed, reactive, ref } from 'vue'

interface Props {
    patient: PatientModel
    owner?: OwnerModel
    hospitalization?: HospitalizationModel
    budget?: BudgetModel
}

interface Emits {
    (e: 'reloadPage'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

// Um único ponto de resolução para os detalhes: a excepção do episódio quando
// existe, senão o tutor principal.
const effectiveContact = computed<ContactModel | undefined>(() =>
    resolveEffectiveContact(props.owner, props.hospitalization?.contact)
)

const contactIsSpecific = computed<boolean>(() => !!props.hospitalization?.contact)
const dialogRef = ref<typeof BaseDialog>()
const tabs = reactive([
    { id: '1', name: 'Paciente', active: true },
    { id: '2', name: 'Hospitalização', active: false },
    { id: '3', name: 'Orçamento', active: false },
    { id: '4', name: 'Histórico', active: false }
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
                    :key="tab.id"
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
            :contact="effectiveContact"
            :contact-is-specific="contactIsSpecific"
            :active="getTab('2')?.active"
            @close-dialog="close()"
        />
        <BudgetDetails
            :budget="budget"
            :patient-id="patient.systemId"
            :active="getTab('3')?.active"
            @close-dialog="close()"
        />
        <HospitalizationHistory
            :patient-id="patient.systemId"
            :active="getTab('4')?.active ?? false"
        />
    </BaseDialog>
</template>
