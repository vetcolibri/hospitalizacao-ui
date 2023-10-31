<script lang="ts">
import BaseParameter from './BaseParameter.vue'
import { ref } from 'vue'
</script>

<script setup lang="ts">
const emit = defineEmits(['state', 'update:modelValue'])
const temperature = ref<string>('')
const message = ref<string>('')

const updateValue = () => {
    emit('update:modelValue', temperature.value)
}

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
    emit('state', message.value)
}

defineProps(['latestMeasurement'])
</script>

<template>
    <BaseParameter title="Temperatura" helpText="(37.5 - 39) ºC" :measurement="latestMeasurement">
        <input
            class="form-control"
            placeholder="Valor"
            min="0"
            max="100"
            required
            type="number"
            v-model="temperature"
            @input="() => updateValue()"
            @keyup="() => parameterState()"
        />
    </BaseParameter>
</template>
