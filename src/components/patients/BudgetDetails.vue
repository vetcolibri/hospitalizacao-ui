<script setup lang="ts">
import { formatDate } from '@/lib/shared/format_date'
import { budgetColor } from '@/lib/shared/budget_color'
import type { BudgetModel } from '@/lib/models/budget'

interface Props {
    budget?: BudgetModel
    active: boolean
}

withDefaults(defineProps<Props>(), { active: false })
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
    </div>
</template>
