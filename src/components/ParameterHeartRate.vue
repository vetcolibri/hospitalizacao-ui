<script setup lang="ts">
import { makeHourFormat, makeTodayFormat } from '@/lib/shared/utils'
import { Parameter } from '@/lib/types'
import { ref } from 'vue'

const heartRate = ref()
const message = ref<string>('')
const props = defineProps<Parameter>()
const emit = defineEmits()

const date = props.lastMeasurement?.value ? new Date(props.lastMeasurement?.date!) : new Date()
const hour = makeHourFormat(date)
const today = makeTodayFormat(date)

const updateValue = () => {
    const data = { value: heartRate.value, message }
    emit('update:modelValue', data)
}

function parameterValidation() {
    const value = parseInt(heartRate.value)
    if (heartRate.value === '') {
        message.value = ''
    } else if (value >= 0 && value <= 69) {
        message.value = 'Bradicardia'
    } else if (value >= 70 && value <= 120) {
        message.value = ''
    } else if (value > 120) {
        message.value = 'Taquicardia'
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
                    v-model="heartRate"
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
                    Ultima medição: {{ today }}, {{ hour }}.
                </span>
            </div>
        </div>
    </div>
</template>
