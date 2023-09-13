<script setup lang="ts">
import { ref } from 'vue'

const date = new Date()
const yearFormat = new Intl.DateTimeFormat('pt-PT', { year: 'numeric' })
const monthFormat = new Intl.DateTimeFormat('pt-PT', { month: 'short' })
const dayFormat = new Intl.DateTimeFormat('pt-PT', { day: '2-digit' })
const hour = ref(new Intl.DateTimeFormat('pt-PT', { timeStyle: 'short' }).format(date))
const today = ref(
    `${dayFormat.format(date)} ${monthFormat.format(date)} ${yearFormat.format(date)}`
)
</script>
<template>
    <section>
        <div class="flex justify-end gap-3">
            <div class="p-2 border rounded bg-gray-100">{{ today }}</div>
            <div class="p-2 border rounded bg-gray-100">{{ hour }}</div>
        </div>
    </section>
</template>
