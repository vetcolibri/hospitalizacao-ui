<script lang="ts">
import BaseParameter from './BaseParameter.vue'
import { Parameter } from '@/lib/domain/parameter'
import { reactive } from 'vue'
</script>

<script setup lang="ts">
const hct = reactive(new Parameter())

defineEmits(['update:modelValue'])
defineProps(['latestMeasurement'])
</script>

<template>
    <div class="group-parameter">
        <BaseParameter
            title="HCT"
            helpText="Canino (37 - 55)% e Felino (24 - 45)%"
            class="flex-1"
            :measurement="latestMeasurement"
        >
            <input
                class="form-control"
                placeholder="Valor"
                min="0"
                max="100"
                type="number"
                step="0.01"
                :required="hct.required"
                :class="{ disabled: !hct.required }"
                v-model="hct.value"
                @input="$emit('update:modelValue', Number(hct.value))"
            />
        </BaseParameter>
        <i
            class="bi cursor-pointer text-xl mt-3"
            @click="hct.toogleEnable()"
            :class="hct.required ? 'bi-unlock' : 'bi-lock'"
        ></i>
    </div>
</template>
