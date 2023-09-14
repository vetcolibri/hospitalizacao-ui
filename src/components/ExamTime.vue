<script setup lang="ts">
import { makeHourFormat, makeTodayFormat } from '@/lib/shared/utils'

const date = new Date()
const today = makeTodayFormat(date)
const hour = makeHourFormat(date)
</script>
<template>
    <section>
        <div class="flex justify-end gap-3">
            <div class="p-2 border rounded bg-gray-100">{{ today }}</div>
            <div class="p-2 border rounded bg-gray-100">{{ hour }}</div>
        </div>
    </section>
</template>
