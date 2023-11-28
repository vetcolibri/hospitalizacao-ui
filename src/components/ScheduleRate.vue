<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { units } from '@/lib/data/alerts'

const repeatEvery = ref({ rate: 30, unity: 'minutes' })
const message = ref<string>('')
const emit = defineEmits()
const updateValue = () => {
    emit('update:modelValue', repeatEvery.value)
}

function isValid() {
    if (repeatEvery.value.rate < 1) {
        message.value = 'O valor deve ser maior que 1'
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
        <label for="rate" class="block">Repetir a cada</label>
        <div class="flex items-center space-x-2">
            <div class="w-16">
                <input
                    class="form-control text-center"
                    type="number"
                    min="1"
                    name="rate"
                    v-model="repeatEvery.rate"
                    @input="updateValue()"
                    :class="isValid() ? 'form-invalid' : ''"
                />
            </div>
            <div class="w-24">
                <select class="form-control" name="unity" v-model="repeatEvery.unity">
                    <option v-for="unity in units" :value="unity.value">{{ unity.name }}</option>
                </select>
            </div>
        </div>
    </div>
    <small class="text-xs sm:text-base text-red-500">{{ message }}</small>
</template>
