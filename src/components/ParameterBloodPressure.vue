<script setup lang="ts">
import { makeHourFormat, makeTodayFormat } from '@/lib/shared/utils'
import type { Parameter } from '@/models/parameter'
import { ref } from 'vue'

const bloodPressure = ref()
const message = ref<string>('')
const props = defineProps<Parameter>()
const emit = defineEmits()

const date = props.lastMeasurement?.date ? new Date(props.lastMeasurement?.date!) : new Date()
const hour = makeHourFormat(date)
const today = makeTodayFormat(date)

const updateValue = () => {
    const data = { value: bloodPressure.value, message }
    emit('update:modelValue', data)
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
                    v-model="bloodPressure"
                    required
                    :name="name"
                    :type="type ? type : 'number'"
                    @input="() => updateValue()"
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
