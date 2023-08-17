<script setup lang="ts">
import { Parameter } from '@/lib/types'

const props = defineProps<Parameter>()
const emit = defineEmits()

const updateValue = (event: InputEvent) => {
   emit("update:modelValue", (event.target as HTMLInputElement).value)
}
</script>

<template>
    <div class="flex flex-col gap-2">
        <p>{{ props.title }}</p>
        <div class="flex gap-4">
            <div class="flex flex-col flex-1 gap-1">
                <select 
                    v-if="props.isCombox" 
                    class="form-control text-gray-500" 
                    :name="props.name"
                    @input="(e) => updateValue(e as InputEvent)" 
                >
                    <option>Escolha um valor</option>
                    <option v-for="opt in options" :value="opt">{{  opt }}</option>
                </select>
                <input v-else 
                    class="form-control" 
                    type="number" 
                    step="1" 
                    min="0" 
                    max="500" 
                    :name="props.name"
                    @input="(e) => updateValue(e as InputEvent)" 
                    placeholder="Valor"
                />
                <span class="text-sm text-gray-600">{{ props.helpText }}</span>
            </div>
            <div class="flex flex-col flex-1 gap-1">
                <input class="form-control bg-gray-200" disabled type="text" placeholder="N/D">
            </div>
        </div>
    </div>
</template>
