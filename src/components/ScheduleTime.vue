<script setup lang="ts">
defineProps(['time'])
</script>
<template>
    <div class="w-32 space-y-1">
        <label for="time" class="block">Hora do alerta</label>
        <input class="form-control" type="time" name="hour" :value="time" required>
    </div>
</template>