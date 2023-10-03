<script setup lang="ts">
import { makeHourFormat } from '@/lib/shared/utils'
import { onBeforeMount, ref } from 'vue'

const emit = defineEmits()
const date = new Date()
const hour = ref()
hour.value = makeHourFormat(date)

const updateValue = () => {
    emit('update:modelValue', hour.value)
}

onBeforeMount(() => {
    updateValue()
})
</script>
<template>
    <div class="space-y-1">
        <label for="time" class="block">Hora do alerta</label>
        <div class="w-32">
            <input
                class="form-control text-center w-24"
                type="time"
                name="hour"
                @input="() => updateValue()"
                v-model="hour"
            />
        </div>
    </div>
</template>
