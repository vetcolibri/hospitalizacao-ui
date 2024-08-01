<script setup lang="ts">
interface Props {
    value: any
    status: string
    colors?: any
    options?: string[]
}

defineProps<Props>()
</script>
<template>
    <div
        v-if="value && !colors"
        :class="{
            'badge-success': status === 'Normal',
            'badge-danger': status !== 'Normal'
        }"
        class="text-center"
    >
        {{ status ? status : value }}
    </div>

    <div v-if="colors && !options" :class="colors[value]" class="text-center">
        {{ status }}
    </div>

    <div v-if="colors && options" :class="colors[value]" class="text-center">
        {{ value }}
    </div>
</template>
