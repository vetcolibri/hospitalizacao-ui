<script setup lang="ts">
import type { BudgetModel } from '@/lib/models/budget'
import { BudgetStatus } from '@/lib/models/budget'
import { Provided } from '@/lib/provided'
import type { PatientService } from '@/lib/services/patient_service'
import { budgetColor } from '@/lib/shared/budget_color'
import { formatDate } from '@/lib/shared/format_date'

import { inject, ref } from 'vue'

interface Props {
    budget?: BudgetModel
    patientId: string
    active: boolean
}

interface Emits {
    (e: 'closeDialog'): void
}

const props = withDefaults(defineProps<Props>(), { active: false })
const emits = defineEmits<Emits>()
const status = ref<string>('')
const service = inject<PatientService>(Provided.PatientService)!

function chooseStatus(event: Event) {
    status.value = (event.target as HTMLSelectElement).value
}

async function endBudget() {
    if (!props.budget) return

    await service.endBudget(props.budget.hospitalizationId, props.patientId, status.value)

    status.value = ''

    emits('closeDialog')
}
</script>
<template>
    <div v-show="active" class="space-y-3">
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
                <span :class="budgetColor(budget?.status)"> {{ budget?.status }} </span>
            </li>
        </ul>

        <h1 class="text-gray-500">Estado do Orçamento</h1>

        <form class="space-y-3">
            <select class="form-control text-black" @change="chooseStatus">
                <option selected disabled>Escolher estado</option>
                <option :value="BudgetStatus.Unpaid">{{ BudgetStatus.Unpaid }}</option>
                <option :value="BudgetStatus.Pending">{{ BudgetStatus.Pending }}</option>
                <option :value="BudgetStatus.PendingWithBudgetSent">
                    {{ BudgetStatus.PendingWithBudgetSent }}
                </option>
                <option :value="BudgetStatus.Paid">{{ BudgetStatus.Paid }}</option>
            </select>

            <button
                type="button"
                class="btn w-full"
                :class="{
                    'btn-success': status.length > 0,
                    disabled: status.length === 0
                }"
                @click="endBudget()"
            >
                SALVAR
            </button>
        </form>
    </div>
</template>
