<script setup lang="ts">
import { makeHourFormat, makeTodayFormat } from '@/lib/shared/utils'
import type { Parameter } from '@/models/parameter'

const props = defineProps<Parameter>()
const emit = defineEmits()

const date = props.lastMeasurement?.date ? new Date(props.lastMeasurement?.date!) : new Date()
const hour = makeHourFormat(date)
const today = makeTodayFormat(date)

const updateValue = (event: InputEvent) => {
    const data = { value: (event.target as HTMLSelectElement).value, message: '' }
    emit('update:modelValue', data)
}
</script>

<template>
    <div class="flex flex-col gap-2">
        <p>{{ title }}</p>
        <div class="flex gap-4">
            <div class="flex flex-col flex-1 gap-1">
                <select
                    class="form-control text-gray-500"
                    :name="name"
                    @input="(e) => updateValue(e as InputEvent)"
                    required
                >
                    <option value="">Escolha um valor</option>
                    <option v-for="opt in options" :value="opt">{{ opt }}</option>
                </select>
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
