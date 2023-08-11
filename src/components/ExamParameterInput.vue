<script setup lang="ts">
defineProps(["title", "name", "helpText"])
</script>

<template>
    <div class="flex flex-col gap-2">
        <p>{{ title }}</p>
        <div class="flex gap-4">
            <div class="flex flex-col flex-1 gap-1">
                <input class="form-control" type="number" step="1" min="0" max="500" name="{{ name }}" placeholder="Valor" required>
                <span class="text-sm text-gray-600">{{ helpText }}</span>
            </div>
            <div class="flex flex-col flex-1 gap-1">
                <input class="form-control bg-gray-200" disabled type="text" placeholder="N/D">
            </div>
        </div>
    </div>
</template>
