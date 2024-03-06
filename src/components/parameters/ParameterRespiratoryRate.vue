<script lang="ts">
import BaseParameter from './BaseParameter.vue'
import { Parameter } from '@/lib/domain/parameter'
import { reactive, ref } from 'vue'
</script>

<script setup lang="ts">
interface Emits {
    (e: 'state', message: string): void
    (e: 'update:modelValue', value: number): void
}

const emits = defineEmits<Emits>()
const respiratoryRate = reactive(new Parameter())
const message = ref<string>('')

function parameterState() {
    const value = parseInt(respiratoryRate.value)
    if (respiratoryRate.value === '') {
        message.value = ''
    } else if (value >= 0 && value <= 9) {
        message.value = 'Bradipnéia'
    } else if (value >= 10 && value <= 30) {
        message.value = ''
    } else if (value > 30 && value <= 100) {
        message.value = 'Taquipnéia'
    }
    emits('state', message.value)
}

defineProps(['latestMeasurement'])
</script>

<template>
    <div class="group-parameter">
        <BaseParameter
            title="Frequência Respiratória"
            helpText="(10 - 30) RPM"
            class="flex-1"
            :measurement="latestMeasurement"
        >
            <input
                class="form-control"
                placeholder="Valor"
                min="0"
                max="100"
                step="0.01"
                type="number"
                :required="respiratoryRate.required"
                :class="{ disabled: !respiratoryRate.required }"
                v-model="respiratoryRate.value"
                @input="$emit('update:modelValue', Number(respiratoryRate.value))"
                @keyup="parameterState()"
            />
        </BaseParameter>
        <i
            class="bi cursor-pointer text-xl mt-3"
            @click="respiratoryRate.toogleEnable()"
            :class="respiratoryRate.required ? 'bi-unlock' : 'bi-lock'"
        ></i>
    </div>
</template>
@/lib/parameter
