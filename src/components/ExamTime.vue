<script setup lang="ts">
import { makeHourFormat, makeTodayFormat } from '@/lib/shared/utils'

const date = new Date()
const today = makeTodayFormat(date)
const hour = makeHourFormat(date)
</script>
<template>
    <section>
        <ul class="flex justify-end gap-3">
            <li class="p-2 border rounded bg-gray-100">{{ today }}</li>
            <li class="p-2 border rounded bg-gray-100">{{ hour }}</li>
        </ul>
    </section>
</template>
