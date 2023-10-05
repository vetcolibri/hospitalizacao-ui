<script setup lang="ts">
interface Props {
    title: string
    value?: string
    type?: string
    disabled?: boolean
    readonly?: boolean
    isSelect?: boolean
    isRequired?: boolean
}
defineProps<Props>()
</script>

<template>
    <div>
        <label class="text-sm">{{ title }}</label>
        <input
            v-if="isSelect"
            class="form-control form-select mt-2"
            :value="value"
            :type="type ? type : 'text'"
            :class="disabled ? 'disabled' : ''"
            :disabled="disabled ? true : false"
            :readonly="readonly ? true : false"
            :required="isRequired"
        />
        <input
            v-else
            class="form-control mt-2"
            :value="value"
            :type="type ? type : 'text'"
            :class="disabled ? 'disabled' : ''"
            :disabled="disabled ? true : false"
            :readonly="readonly ? true : false"
            :required="isRequired"
        />
    </div>
</template>
