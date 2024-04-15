<script setup lang="ts">
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'

import { COMPLAINTS } from '@/lib/data/complaints'
import { DIAGNOSTICS } from '@/lib/data/diagnostics'
import { ref } from 'vue'

interface Hospitalization {
    weight: number
    complaints: string[]
    diagnostics: string[]
    entryDate: string
    dischargeDate: string
}

const hospitalization = ref<Hospitalization>({
    weight: 0,
    complaints: [],
    diagnostics: [],
    entryDate: '',
    dischargeDate: ''
})

defineEmits<{ (e: 'hospitalization', value: Hospitalization): void }>()
</script>

<template>
    <section class="container rounded mb-4">
        <h1 class="font-medium">Hospitalização</h1>

        <p class="text-sm text-gray-500 leading-5">
            Preencha os campos abaixo com os dados da hospitalização.
        </p>

        <BaseInput
            type="number"
            placeholder="Peso Kg"
            v-model="hospitalization.weight"
            :required="true"
            :max="100"
            :min="1"
            :step="0.01"
            @update:model-value="$emit('hospitalization', hospitalization)"
        />

        <BaseSelect
            title="Escolher Queixas"
            v-model="hospitalization.complaints"
            :options="COMPLAINTS"
            :limit="10"
            @update:model-value="$emit('hospitalization', hospitalization)"
        />

        <BaseSelect
            title="Escolher Diagnosticos"
            v-model="hospitalization.diagnostics"
            :options="DIAGNOSTICS"
            :limit="5"
            @update:model-value="$emit('hospitalization', hospitalization)"
        />

        <div class="form-container">
            <BaseInput
                title="Data de entrada"
                type="date"
                class="flex-1"
                v-model="hospitalization.entryDate"
                :required="true"
                @update:model-value="$emit('hospitalization', hospitalization)"
            />

            <BaseInput
                title="Previsão de Alta Médica"
                type="date"
                class="flex-1"
                v-model="hospitalization.dischargeDate"
                @update:model-value="$emit('hospitalization', hospitalization)"
            />
        </div>
    </section>
</template>
