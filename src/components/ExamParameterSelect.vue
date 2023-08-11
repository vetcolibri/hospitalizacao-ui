<script setup lang="ts">
defineProps(["title", "name", "options", "helpText"])
</script>

<template>
    <div class="flex flex-col gap-2">
        <p>{{ title }}</p>
        <div class="flex gap-4">
            <div class="flex flex-col flex-1 gap-1">
                <select class="form-control text-gray-500">
                    <option>Escolha uma opção</option>
                </select>
                <span class="text-sm text-gray-600">{{ helpText }}</span>
            </div>
            <div class="flex flex-col flex-1 gap-1">
                <input class="form-control bg-gray-200" disabled type="text" placeholder="N/D">
            </div>
        </div>
    </div>
</template>
