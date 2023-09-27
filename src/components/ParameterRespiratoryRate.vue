<script setup lang="ts">
import { vLastMeasurement } from '@/lib/shared/utils'
import type { Parameter } from '@/models/parameter'
import { ref } from 'vue'

const respiratoryRate = ref()
const message = ref<string>('')
defineProps<Parameter>()
const emit = defineEmits()

const updateValue = () => {
    const data = { value: respiratoryRate.value, message }
    emit('update:modelValue', data)
}

function parameterValidation() {
    const value = parseInt(respiratoryRate.value)
    if (respiratoryRate.value === '') {
        message.value = ''
    } else if (value >= 0 && value <= 9) {
        message.value = 'Bradipnéia'
    } else if (value >= 10 && value <= 30) {
        message.value = ''
    } else if (value > 30 && value <= 100) {
        message.value = 'Taquipnéia'
    }
}
</script>

<template>
    <div class="flex flex-col gap-2">
        <p>{{ title }}</p>
        <div class="flex gap-4">
            <div class="flex flex-col flex-1 gap-1">
                <input
                    class="form-control"
                    placeholder="Valor"
                    v-model="respiratoryRate"
                    min="0"
                    max="100"
                    required
                    :name="name"
                    :type="type ? type : 'number'"
                    @input="() => updateValue()"
                    @keyup="() => parameterValidation()"
                />
                <span class="text-sm text-gray-600">{{ helpText }}</span>
            </div>
            <div class="flex flex-col flex-1 gap-1">
                <input
                    class="form-control disabled"
                    disabled
                    type="text"
                    :placeholder="lastMeasurement ? lastMeasurement.value : 'N/D'"
                />
                <span
                    v-if="lastMeasurement?.value"
                    v-last-measurement="lastMeasurement?.date!"
                    class="text-sm text-gray-600"
                >
                </span>
            </div>
        </div>
    </div>
</template>
