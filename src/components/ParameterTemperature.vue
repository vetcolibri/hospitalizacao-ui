<script setup lang="ts">
import { Parameter } from '@/lib/types'
import { ref } from 'vue';

const inputElement = ref()
const message = ref<string>('')
const props = defineProps<Parameter>()
const emit = defineEmits()

const updateValue = () => {
    const data = { value: inputElement.value, message}
    emit('update:modelValue', data)
}

function parameterValidation (){
    const value = parseFloat(inputElement.value)
    if (inputElement.value === '' || value > 50) {
        inputElement.value = ''
        message.value = ''
    } else if (value >= 37.5 && value <= 39.5){
        message.value = ''
    } else if (value < 37.5) {
        message.value = 'Hipotermia'
    } else if (value > 39.5) {
        message.value = 'Hipertermia'
    }
}
</script>

<template>
    <div class="flex flex-col gap-2">
        <p>{{ props.title }}</p>
        <div class="flex gap-4">
            <div class="flex flex-col flex-1 gap-1">
                <input
                    class="form-control"
                    placeholder="Valor"
                    v-model="inputElement"
                    step="0.1"
                    min="0"
                    max="100"
                    required
                    :name="props.name"
                    :type="props.type ? props.type : 'number'"
                    @input="() => updateValue()"
                    @keyup="() => parameterValidation()"
                />
                <span class="text-sm text-gray-600">
                    {{ message.length > 0 ? message : props.helpText }}
                </span>
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
