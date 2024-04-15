<script setup lang="ts">
import { formatDate } from '@/lib/shared/format_date'

const today = new Date()
</script>
<template>
    <div class="badge-dark w-fit ml-auto">
        {{ formatDate(today.toISOString()) }}
    </div>
</template>
