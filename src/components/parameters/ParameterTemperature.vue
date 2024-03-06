<script lang="ts">
import { Parameter } from '@/lib/domain/parameter'
import BaseParameter from './BaseParameter.vue'
import { reactive, ref } from 'vue'
</script>

<script setup lang="ts">
interface Emits {
    (e: 'state', message: string): void
    (e: 'update:modelValue', value: number): void
}

const emits = defineEmits<Emits>()

const temperature = reactive(new Parameter())
const message = ref<string>('')

function parameterState() {
    const value = parseInt(temperature.value)
    if (temperature.value === '') {
        message.value = ''
    } else if (value >= 37.5 && value <= 39.5) {
        message.value = ''
    } else if (value < 37.5) {
        message.value = 'Hipotermia'
    } else if (value > 39.5) {
        message.value = 'Hipertermia'
    }
    emits('state', message.value)
}

defineProps(['latestMeasurement'])
</script>

<template>
    <div class="group-parameter">
        <BaseParameter
            title="Temperatura"
            helpText="(37.5 - 39) ºC"
            class="flex-1"
            :measurement="latestMeasurement"
        >
            <input
                class="form-control"
                placeholder="Valor"
                type="number"
                min="0"
                max="100"
                step="0.01"
                v-model="temperature.value"
                :required="temperature.required"
                :class="{ disabled: !temperature.required }"
                @input="$emit('update:modelValue', Number(temperature.value))"
                @keyup="parameterState()"
            />
        </BaseParameter>
        <i
            class="bi cursor-pointer text-xl mt-3"
            @click="temperature.toogleEnable()"
            :class="temperature.required ? 'bi-unlock' : 'bi-lock'"
        ></i>
    </div>
</template>
@/lib/parameter
