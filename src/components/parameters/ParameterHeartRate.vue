<script lang="ts">
import { HeartRate } from '@/lib/domain/heart_rate'
import BaseParameter from './BaseParameter.vue'
import { reactive } from 'vue'
</script>

<script setup lang="ts">
interface Emits {
    (e: 'state', message: string): void
    (e: 'update:modelValue', value: number): void
}

const heartRate = reactive(new HeartRate())

defineEmits<Emits>()
defineProps(['latestMeasurement'])
</script>

<template>
    <div class="group-parameter">
        <BaseParameter
            class="flex-1"
            :title="heartRate.name"
            :helpText="heartRate.helpText"
            :measurement="latestMeasurement"
        >
            <input
                class="form-control"
                placeholder="Valor"
                type="number"
                :min="heartRate.min"
                :max="heartRate.max"
                :class="{ disabled: !heartRate.required }"
                :required="heartRate.required"
                v-model="heartRate.value"
                @input="$emit('update:modelValue', heartRate.numberValue)"
                @keyup="$emit('state', heartRate.verifyStatus())"
            />
        </BaseParameter>
        <i
            class="bi cursor-pointer text-xl mt-3"
            :class="heartRate.required ? 'bi-unlock' : 'bi-lock'"
            @click="heartRate.toogleEnable()"
        ></i>
    </div>
</template>
