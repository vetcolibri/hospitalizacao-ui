<script setup lang="ts">
import { ref } from 'vue'
import { UNITS } from '@/lib/data/alerts'

interface Emits {
    (e: 'rate', value: number): void
    (e: 'unit', value: string): void
}

const emits = defineEmits<Emits>()
const repeatEvery = ref({ rate: 30, unit: 'minutes' })
const message = ref<string>('')

function isValid() {
    if (repeatEvery.value.rate < 1) {
        message.value = 'O valor deve ser maior que 1'
        return true
    }
    message.value = ''
    return false
}
</script>
<template>
    <div class="space-y-1">
        <label for="rate" class="block">Repetir a cada</label>
        <div class="flex items-center space-x-2">
            <div class="w-16">
                <input
                    class="form-control text-center"
                    type="number"
                    min="1"
                    v-model="repeatEvery.rate"
                    :class="isValid() ? 'form-invalid' : ''"
                    @input="$emit('rate', repeatEvery.rate)"
                />
            </div>
            <div class="w-24">
                <select
                    class="form-control"
                    v-model="repeatEvery.unit"
                    @change="$emit('unit', repeatEvery.unit)"
                >
                    <option v-for="unit in UNITS" :value="unit.value">{{ unit.name }}</option>
                </select>
            </div>
        </div>
    </div>
    <small class="text-xs sm:text-base text-red-500">{{ message }}</small>
</template>
