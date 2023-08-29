<script setup lang="ts">
import { Parameter } from '@/lib/types'

defineProps<Parameter>()
const emit = defineEmits()

const updateValue = (event: InputEvent) => {
    emit('update:modelValue', (event.target as HTMLSelectElement).value)
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
                <input class="form-control disabled" disabled type="text"
                    :placeholder="lastMeasurement ? lastMeasurement.value : 'N/D'"/>
                <span v-if="lastMeasurement?.value" class="text-sm text-gray-600">
                    Ultima medição as {{ lastMeasurement?.hour }}
                </span>
            </div>
        </div>
    </div>
</template>
