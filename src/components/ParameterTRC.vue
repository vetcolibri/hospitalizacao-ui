<script setup lang="ts">
import { makeHourFormat, makeTodayFormat } from '@/lib/shared/utils'
import { Parameter } from '@/lib/types'
import { ref } from 'vue'

const trc = ref()
const message = ref<string>('')
const props = defineProps<Parameter>()
const emit = defineEmits()

const date = props.lastMeasurement?.date ? new Date(props.lastMeasurement?.date!) : new Date()
const hour = makeHourFormat(date)
const today = makeTodayFormat(date)

const updateValue = () => {
    const data = { value: trc.value, message }
    emit('update:modelValue', data)
}

function parameterValidation() {
    const value = parseFloat(trc.value)
    if (trc.value === '') {
        message.value = ''
    } else if (value >= 0 && value <= 2) {
        message.value = ''
    } else if (value > 2) {
        message.value = 'Vasoconstrição'
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
                    v-model="trc"
                    min="0"
                    max="10"
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
