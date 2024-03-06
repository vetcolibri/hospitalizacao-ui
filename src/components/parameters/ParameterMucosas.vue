<script lang="ts">
import { mucosasOptions } from '@/lib/data/parameters'
import BaseParameter from './BaseParameter.vue'
import { Parameter } from '@/lib/domain/parameter'
import { reactive } from 'vue'
</script>

<script setup lang="ts">
const mucosas = reactive(new Parameter())
const emits = defineEmits(['update:modelValue'])

const updateValue = (event: InputEvent) => {
    emits('update:modelValue', (event.target as HTMLSelectElement).value)
}

defineProps(['latestMeasurement'])
</script>

<template>
    <div class="group-parameter">
        <BaseParameter title="Mucosas" class="flex-1" :measurement="latestMeasurement">
            <select
                class="form-control text-gray-500"
                :required="mucosas.required"
                :class="{ disabled: !mucosas.required }"
                @input="(e) => updateValue(e as InputEvent)"
            >
                <option value>Escolha um valor</option>
                <option v-for="opt in mucosasOptions" :value="opt">{{ opt }}</option>
            </select>
        </BaseParameter>
        <i
            class="bi cursor-pointer text-xl mt-6"
            @click="mucosas.toogleEnable()"
            :class="mucosas.required ? 'bi-unlock' : 'bi-lock'"
        ></i>
    </div>
</template>
@/lib/parameter
