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
const glicemia = reactive(new Parameter())
const message = ref<string>('')

function parameterState() {
    const value = parseFloat(glicemia.value)
    if (glicemia.value === '') {
        message.value = ''
    } else if (value < 60) {
        message.value = 'Hipoglicemia'
    } else if (value >= 60 && value <= 100) {
        message.value = ''
    } else if (value > 100) {
        message.value = 'Hiperglicemia'
    }

    emits('state', message.value)
}
defineProps(['latestMeasurement'])
</script>

<template>
    <div class="group-parameter">
        <BaseParameter
            title="Glicemia"
            helpText="(60 - 100) mg/dl"
            class="flex-1"
            :measurement="latestMeasurement"
        >
            <input
                class="form-control"
                placeholder="Valor"
                min="0"
                max="300"
                type="number"
                step="0.01"
                :required="glicemia.required"
                :class="{ disabled: !glicemia.required }"
                v-model="glicemia.value"
                @input="$emit('update:modelValue', Number(glicemia.value))"
                @keyup="parameterState()"
            />
        </BaseParameter>
        <i
            class="bi cursor-pointer text-xl mt-3"
            @click="glicemia.toogleEnable()"
            :class="glicemia.required ? 'bi-unlock' : 'bi-lock'"
        ></i>
    </div>
</template>
@/lib/parameter
