<script setup lang="ts">
interface Props {
    value: any
    status: string
    colors?: any
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
    >
        {{ status ? status : value }}
    </div>

    <div v-if="colors" :class="colors[value]">
        {{ value }}
    </div>
</template>
