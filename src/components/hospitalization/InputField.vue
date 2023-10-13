<script setup lang="ts">
import { ref } from 'vue'

interface Props {
    title: string
    value?: string
    type?: string
    disabled?: boolean
    readonly?: boolean
    isSelect?: boolean
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
        <label class="text-sm">{{ title }}</label>
        <input
            v-if="isSelect"
            class="form-control form-select mt-2"
            :placeholder="value ? value : ''"
            :type="type ? type : 'text'"
            :class="disabled ? 'disabled' : ''"
            :disabled="disabled ? true : false"
            :readonly="readonly ? true : false"
            :required="isRequired"
        />
        <input
            v-else
            class="form-control mt-2"
            :placeholder="value ? value : ''"
            :type="type ? type : 'text'"
            :class="disabled ? 'disabled' : ''"
            :disabled="disabled ? true : false"
            :readonly="readonly ? true : false"
            :required="isRequired"
            v-model="inputValue"
            @input="emitValue()"
        />
    </div>
</template>
