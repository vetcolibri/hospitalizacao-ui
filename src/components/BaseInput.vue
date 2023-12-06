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
    step?: number
    isRequired?: boolean
    pattern?: string
    helpText?: string
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
        <label v-if="title">{{ title }}</label>
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
            :step="step ? step : ''"
            :pattern="pattern ? pattern : undefined"
            :title="helpText ? helpText : ''"
            :autocomplete="type === 'password' ? 'current-password' : ''"
            v-model="inputValue"
            @input="emitValue()"
        />
    </div>
</template>
