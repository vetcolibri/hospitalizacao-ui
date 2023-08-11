<script setup lang="ts">
defineProps(["title", "name", "helpText"])
</script>

<template>
    <div class="overflow-y-auto border rounded space-y-2 p-3">
        <div class="flex items-center">
            <input type="checkbox" class="rounded" name="">
            <label class="ml-2 block text-gray-900">Frequência Cardiaca</label>
        </div>
        <div class="flex items-center">
            <input type="checkbox" class="rounded" name="">
            <label class="ml-2 block text-gray-900">Frequência Respiratória</label>
        </div>
        <div class="flex items-center">
            <input type="checkbox" class="rounded" name="">
            <label class="ml-2 block text-gray-900">TRC</label>
        </div>
        <div class="flex items-center">
            <input type="checkbox" class="rounded" name="">
            <label class="ml-2 block text-gray-900">Mucosas</label>
        </div>
        <div class="flex items-center">
            <input type="checkbox" class="rounded" name="">
            <label class="ml-2 block text-gray-900">AVDN</label>
        </div>
        <div class="flex items-center">
            <input type="checkbox" class="rounded" name="">
            <label class="ml-2 block text-gray-900">Temperatura</label>
        </div>
        <div class="flex items-center">
            <input type="checkbox" class="rounded" name="">
            <label class="ml-2 block text-gray-900">Glicemia</label>
        </div>
        <div class="flex items-center">
            <input type="checkbox" class="rounded" name="">
            <label class="ml-2 block text-gray-900">Pressão Arterial</label>
        </div>
        <div class="flex items-center">
            <input type="checkbox" class="rounded" name="">
            <label class="ml-2 block text-gray-900">PAM</label>
        </div>
    </div>
</template>
