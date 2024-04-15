<script setup lang="ts">
import { ref } from 'vue'
import { BudgetStatus } from '@/lib/models/budget'
import BaseInput from '@/components/BaseInput.vue'

interface Budget {
    startOn: string
    endOn: string
    status: string
}

const budget = ref<Budget>({
    startOn: '',
    endOn: '',
    status: ''
})

defineEmits<{ (e: 'budget', value: Budget): void }>()
</script>

<template>
    <section class="container rounded mb-4">
        <h1 class="font-medium">Orçamento</h1>

        <p class="text-sm text-gray-500 leading-5">
            Preencha os campos abaixo com os dados do orçamento.
        </p>

        <div class="flex-1 mt-2">
            <select
                class="form-control"
                required
                v-model="budget.status"
                @change="$emit('budget', budget)"
            >
                <option value="" selected>Escolher Estado</option>
                <option :value="BudgetStatus.Unpaid">Não Pago</option>
                <option :value="BudgetStatus.Pending">Pendente</option>
                <option :value="BudgetStatus.PendingWithBudgetSent">
                    Pendente (Orçamento enviado)
                </option>
                <option :value="BudgetStatus.Paid">Pago</option>
            </select>
        </div>

        <div class="form-container">
            <BaseInput
                title="Inicia em"
                type="date"
                class="flex-1"
                v-model="budget.startOn"
                :required="true"
                @update:model-value="$emit('budget', budget)"
            />

            <BaseInput
                title="Termina em"
                type="date"
                class="flex-1"
                v-model="budget.endOn"
                :required="true"
                @update:model-value="$emit('budget', budget)"
            />
        </div>
    </section>
</template>
