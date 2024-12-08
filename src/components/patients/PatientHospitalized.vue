<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog.vue'
import BaseInput from '@/components/BaseInput.vue'
import PatientSummary from '@/components/patients/PatientSummary.vue'
import { getCurrentDate } from '@/lib/shared/get_current_date'
import { type BudgetService } from '@/lib/services/budget_service'
import type { AlertModel } from '@/lib/models/alert'
import type { BudgetModel } from '@/lib/models/budget'
import type { HospitalizationModel } from '@/lib/models/hospitalization'
import type { OwnerModel } from '@/lib/models/owner'
import { Provided } from '@/lib/provided'
import type { PatientModel } from '@/lib/models/patient'
import { formatDate } from '@/lib/shared/format_date'
import { ICON_URL } from '@/lib/shared/icon'
import { ref, computed, inject } from 'vue'

interface Props {
    patient: PatientModel
    owners: OwnerModel[]
    hospitalizations: HospitalizationModel[]
    budgets: BudgetModel[]
    alerts: AlertModel[]
}

interface Emits {
    (e: 'nextPage', patientId: string, owerId?: string): void
    (e: 'reloadPage'): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const detailsRef = ref<typeof PatientSummary>()
const editFormRef = ref<typeof BaseDialog>()
const owner = ref<OwnerModel>()
const hospitalization = ref<HospitalizationModel>()
const budget = ref<BudgetModel>()
const isDisabled = computed(() => {
    if (budget.value?.startOn && budget.value.endOn) return false
    return true
})

const findOwner = (id: string) => props.owners.find((o) => o.ownerId === id)
const findBudget = (id: string) => props.budgets.find((b) => b.hospitalizationId === id)
const findAlert = (id: string) => props.alerts.find((a) => a.patientId === id)

const budgetService = inject<BudgetService>(Provided.BudgetService)!

function findHospitalization(id: string) {
    const result = props.hospitalizations.filter((h) => h.patientId === id)

    if (result.length === 0) return

    const active = result.find((h) => h.status === 'Aberta')

    if (active) return active

    return result[result.length - 1]
}

function openDetails(patientId: string, ownerId: string) {
    detailsRef.value?.open()

    owner.value = findOwner(ownerId)

    hospitalization.value = findHospitalization(patientId)

    if (!hospitalization.value) return

    budget.value = findBudget(hospitalization.value.hospitalizationId)
}

function openEditForm(patientId: string) {
    editFormRef.value?.open()

    hospitalization.value = findHospitalization(patientId)

    if (!hospitalization.value) return

    budget.value = findBudget(hospitalization.value.hospitalizationId)
}

function isPending(patient: PatientModel) {
    if (patient.status === 'HOSPITALIZADO') return false

    if (patient.status === 'ALTA MEDICA') return false

    return true
}

async function save() {
    if (!budget.value) return

    await budgetService.update(budget.value)

    editFormRef.value?.close()
}
</script>
<template>
    <section
        class="bg-white p-3.5 rounded shadow-sm border space-y-4"
        :class="{ 'border-yellow-500': findAlert(patient.systemId) }"
    >
        <div class="flex items-center gap-2 border-b pb-1">
            <div class="flex flex-1 gap-2 items-center">
                <img class="w-4 h-4 md:w-8 md:h-8" :src="ICON_URL" alt="patient-icon" />
                <h5 class="flex-1 font-medium">{{ patient.name }}</h5>
            </div>
            <i
                class="bi bi-pencil-square cursor-pointer text-gray-500"
                @click="openEditForm(patient.systemId)"
            ></i>
            <i v-if="isPending(patient)" class="bi bi-bell-fill text-red-500"></i>
            <i
                v-if="findAlert(patient.systemId)"
                class="bi bi-exclamation-circle-fill text-yellow-500"
            >
            </i>
            <i
                class="bi bi-info-circle-fill text-blue-500 cursor-pointer"
                @click="openDetails(patient.systemId, patient.ownerId)"
            ></i>
        </div>
        <div
            class="flex flex-col justify-center cursor-pointer gap-1 mt-4"
            @click="$emit('nextPage', patient.systemId, patient.ownerId)"
        >
            <ul class="patient-info">
                <li class="patient-info-item">
                    <span>ID Paciente</span>
                    <span class="patient-info-text">{{ patient.patientId }}</span>
                </li>
                <li class="patient-info-item">
                    <span>Espécie</span>
                    <span class="patient-info-text">{{ patient.specie }}</span>
                </li>
                <li class="patient-info-item">
                    <span>Data de entrada</span>
                    <span class="patient-info-text">
                        {{ formatDate(findHospitalization(patient.systemId)?.entryDate) }}
                    </span>
                </li>
            </ul>
        </div>
    </section>

    <PatientSummary
        ref="detailsRef"
        :patient="patient"
        :owner="owner"
        :hospitalization="hospitalization"
        :budget="budget"
        @reloadPage="$emit('reloadPage')"
    />

    <BaseDialog ref="editFormRef" title="Prorrogar Orçamento">
        <form v-if="budget">
            <div class="space-y-4">
                <BaseInput
                    title="Inicia em"
                    type="date"
                    class="flex-1"
                    :required="true"
                    :modelValue="getCurrentDate(budget.startOn)"
                    @update:modelValue="budget!.startOn = $event"
                />
                <BaseInput
                    title="Termina em"
                    type="date"
                    class="flex-1"
                    :required="true"
                    :modelValue="getCurrentDate(budget.endOn)"
                    @update:modelValue="budget!.endOn = $event"
                />
            </div>

            <button
                type="button"
                class="btn btn-success w-full uppercase mt-4"
                :class="{ disabled: isDisabled }"
                @click="save()"
            >
                <i class="bi bi-floppy2 mr-2"></i>
                Salvar
            </button>
        </form>
    </BaseDialog>
</template>
