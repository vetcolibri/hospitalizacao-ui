<script setup lang="ts">
import { Parameter } from '@/lib/types'
import { ref } from 'vue'

const inputElement = ref()
const message = ref<string>('')
const emit = defineEmits()

const updateValue = () => {
    const data = { value: inputElement.value, message }
    emit('update:modelValue', data)
}

function parameterValidation() {
    const value = parseInt(inputElement.value)
    if (inputElement.value === '') {
        message.value = ''
    } else if (value >= 0 && value <= 69) {
        message.value = 'Bradicardia'
    } else if (value >= 70 && value <= 120) {
        message.value = ''
    } else if (value > 120) {
        message.value = 'Taquicardia'
    }
}

defineProps<Parameter>()
</script>
<template>
    <div class="flex flex-col gap-2">
        <p>{{ title }}</p>
        <div class="flex gap-4">
            <div class="flex flex-col flex-1 gap-1">
                <input
                    class="form-control"
                    placeholder="Valor"
                    v-model="inputElement"
                    min="0"
                    max="300"
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
                <span v-if="lastMeasurement?.value" class="text-sm text-gray-600">
                    Ultima medição as {{ lastMeasurement?.date }}
                </span>
            </div>
        </div>
    </div>
</template>
