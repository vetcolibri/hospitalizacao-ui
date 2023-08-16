<script setup lang="ts">
    import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue'
</script>
<template>
    <arrow-left @click="$router.back()" class="cursor-pointer" />
</template>