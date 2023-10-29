<script setup lang="ts">
import { ref } from 'vue'

interface Props {
    title?: string
    value?: string
    type?: string
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    isSelect?: boolean
    min?: number
    max?: number
    isRequired?: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])
const inputValue = ref<string | number | Date>()

function emitValue() {
    if (props.disabled && props.readonly) return
    emit('update:modelValue', inputValue.value)
}
</script>

<template>
    <div>
        <label v-if="title" class="text-sm">{{ title }}</label>
        <input
            v-if="isSelect"
            class="form-control form-select"
            :placeholder="placeholder ? placeholder : ''"
            :type="type ? type : 'text'"
            :class="disabled ? 'disabled' : ''"
            :disabled="disabled ? true : false"
            :readonly="readonly ? true : false"
            :required="isRequired"
        />
        <input
            v-else
            class="form-control"
            :placeholder="placeholder ? placeholder : ''"
            :type="type ? type : 'text'"
            :class="disabled ? 'disabled' : ''"
            :disabled="disabled ? true : false"
            :readonly="readonly ? true : false"
            :required="isRequired"
            :min="min ? min : ''"
            :max="max ? max : ''"
            v-model="inputValue"
            @input="emitValue()"
        />
    </div>
</template>
