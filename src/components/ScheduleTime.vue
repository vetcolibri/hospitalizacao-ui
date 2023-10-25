<script setup lang="ts">
import { makeHourFormat } from '@/lib/shared/utils'
import { onBeforeMount, ref } from 'vue'

const emit = defineEmits()
const message = ref<string>('')
const date = new Date()
const hour = ref()
hour.value = makeHourFormat(date)

const updateValue = () => {
    emit('update:modelValue', hour.value)
}

function isValid() {
    const selectedTime = new Date(`1970-01-01T${hour.value}:00`)
    const currentTime = new Date()

    currentTime.setFullYear(1970, 0, 1)
    currentTime.setMilliseconds(0)
    currentTime.setSeconds(0)
    if (selectedTime.getTime() < currentTime.getTime()) {
        message.value = 'A hora deve ser maior que a hora atual'
        return true
    }
    message.value = ''
    return false
}

onBeforeMount(() => {
    updateValue()
})
</script>
<template>
    <div class="space-y-1">
        <label for="time" class="block">Hora do Alerta</label>
        <div class="w-fit text-center">
            <input
                class="form-control"
                type="time"
                name="hour"
                @input="() => updateValue()"
                v-model="hour"
                :class="isValid() ? 'form-invalid' : ''"
            />
        </div>
        <small class="text-sm text-red-500">{{ message }}</small>
    </div>
</template>
