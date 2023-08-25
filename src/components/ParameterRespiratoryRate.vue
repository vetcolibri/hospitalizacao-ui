<script setup lang="ts">
import { Parameter } from '@/lib/types'
import { ref } from 'vue';

const inputElement = ref()
const message = ref<string>('')
const props = defineProps<Parameter>()
const emit = defineEmits()

const updateValue = () => {
    emit('update:modelValue', inputElement.value)
}

function parameterValidation (){
    const value = parseInt(inputElement.value)
    if (inputElement.value === '') message.value = ""
    else if (value >= 0 && value <= 9) {
        message.value = "Bradipnéia"
    } else if (value >= 10 && value <= 30) {
        message.value = ""
    } else if (value > 30 && value <= 100) {
        message.value = "Taquipnéia"  
    } else if (value > 100) {
        inputElement.value = ""
        message.value = ""
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
                    min="0"
                    max="100"
                    required
                    :name="props.name"
                    :type="props.type ? props.type : 'number'"

                    @input="() => updateValue()"
                    @keyup="() => parameterValidation()"
                />
                <span class="text-sm text-gray-600">{{ message.length > 0 ? message : props.helpText }}</span>
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
