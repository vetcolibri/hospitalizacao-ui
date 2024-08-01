<script setup lang="ts">
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
    required?: boolean
    pattern?: string
    helpText?: string
    modelValue?: string | number | Date
}

const props = withDefaults(defineProps<Props>(), {
    required: false
})
const emits = defineEmits(['update:modelValue'])

function emitValue(e: Event) {
    const value = (e.target as HTMLInputElement).value
    if (props.disabled && props.readonly) return

    if (props.type === 'number') {
        return emits('update:modelValue', Number(value))
    }

    emits('update:modelValue', value)
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
            :required="required"
        />

        <input
            v-else
            class="form-control"
            :placeholder="placeholder ? placeholder : ''"
            :type="type ? type : 'text'"
            :class="disabled ? 'disabled' : ''"
            :disabled="disabled ? true : false"
            :readonly="readonly ? true : false"
            :required="required"
            :min="min ? min : ''"
            :max="max ? max : ''"
            :step="step ? step : ''"
            :pattern="pattern ? pattern : undefined"
            :title="helpText ? helpText : ''"
            :autocomplete="type === 'password' ? 'current-password' : ''"
            :value="modelValue ? modelValue : undefined"
            @input="emitValue"
        />
    </div>
</template>
