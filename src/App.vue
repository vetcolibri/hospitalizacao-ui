<script setup lang="ts">
import ParametersAlert from './components/parameters/ParametersAlert.vue'
</script>
<template>
    <div class="bg-gray-200 relative">
        <router-view />
        <ParametersAlert />
    </div>
</template>
