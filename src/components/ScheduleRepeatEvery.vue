<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { units } from '@/data/alerts'

const repeatEveryValue = ref({rate: 30, unity: 'minutes'})
const emit = defineEmits()
const updateValue = (event?: InputEvent) => {
    emit('update:modelValue', repeatEveryValue.value)
}

onBeforeMount(() => {
    updateValue()
})
</script>
<template>
    <div class="space-y-1">
        <label for="rate" class="block">Repetir a cada</label>
        <div class="flex items-center space-x-2">
            <div class="w-12">
                <input 
                    class="form-control text-center" 
                    type="number" 
                    name="rate" 
                    v-model="repeatEveryValue.rate"
                    @input="updateValue()"
                >
            </div>
            <div class="w-32">
                <select class="form-control" name="unity" v-model="repeatEveryValue.unity">
                    <option v-for="unity in units" :value="unity.value">{{ unity.name }}</option>
                </select>
            </div>
        </div>
    </div>
</template>