<script setup lang="ts">
defineProps(['title'])
</script>
<template>
    <header class="flex items-center h-16 shadow-md bg-white">
        <div class="main-content flex flex-1 items-center gap-1">
            <slot></slot>
            <h1 class="text-xs font-medium sm:text-base">{{ title }}</h1>
        </div>
    </header>
</template>
