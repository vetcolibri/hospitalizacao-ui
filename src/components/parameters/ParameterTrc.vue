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
const trc = reactive(new Parameter())
const message = ref<string>('')

function parameterState() {
    const value = parseInt(trc.value)
    if (trc.value === '') {
        message.value = ''
    } else if (value >= 0 && value <= 2) {
        message.value = ''
    } else if (value > 10) {
        message.value = 'Vasoconstrição'
    }
    emits('state', message.value)
}

defineProps(['latestMeasurement'])
</script>

<template>
    <div class="group-parameter">
        <BaseParameter
            title="TRC"
            helpText="(> 2')"
            class="flex-1"
            :measurement="latestMeasurement"
        >
            <input
                class="form-control"
                placeholder="Valor"
                min="0"
                max="10"
                type="number"
                step="0.01"
                :required="trc.required"
                :class="{ disabled: !trc.required }"
                v-model="trc.value"
                @input="$emit('update:modelValue', Number(trc.value))"
                @keyup="parameterState()"
            />
        </BaseParameter>
        <i
            class="bi cursor-pointer text-xl mt-3"
            @click="trc.toogleEnable()"
            :class="trc.required ? 'bi-unlock' : 'bi-lock'"
        ></i>
    </div>
</template>
@/lib/parameter
