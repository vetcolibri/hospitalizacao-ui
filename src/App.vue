<script setup lang="ts">
import Alert from './components/Alert.vue';
</script>
<template>
    <div class="bg-gray-300 relative">
        <router-view></router-view>
        <Alert ref="alertElement" />
    </div>
</template>