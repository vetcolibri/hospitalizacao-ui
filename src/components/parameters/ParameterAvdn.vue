<script lang="ts">
import { avdnOptions } from '@/lib/data/parameters'
import BaseParameter from './BaseParameter.vue'
import { Parameter } from '@/lib/domain/parameter'
import { reactive } from 'vue'
</script>

<script setup lang="ts">
const avdn = reactive(new Parameter())
const emits = defineEmits(['update:modelValue'])

const updateValue = (event: InputEvent) => {
    emits('update:modelValue', (event.target as HTMLSelectElement).value)
}

defineProps(['latestMeasurement'])
</script>

<template>
    <div class="group-parameter">
        <BaseParameter title="AVDN" class="flex-1" :measurement="latestMeasurement">
            <select
                class="form-control text-gray-500"
                :required="avdn.required"
                :class="{ disabled: !avdn.required }"
                @input="(e) => updateValue(e as InputEvent)"
            >
                <option value>Escolha um valor</option>
                <option v-for="opt in avdnOptions" :value="opt">{{ opt }}</option>
            </select>
        </BaseParameter>
        <i
            class="bi cursor-pointer text-xl mt-3"
            @click="avdn.toogleEnable()"
            :class="avdn.required ? 'bi-unlock' : 'bi-lock'"
        ></i>
    </div>
</template>
@/lib/parameter
