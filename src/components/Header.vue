<script setup lang="ts">
defineProps(['title'])
</script>
<template>
    <header class="flex items-center h-16 shadow-md bg-white px-4 md:px-12">
        <div class="main-content flex flex-1 items-center gap-2">
            <slot></slot>
            <h1 class="text-sm md:text-lg">{{ title }}</h1>
        </div>
    </header>
</template>
