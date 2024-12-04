<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
<template>
    <div class="h-screen text-center">
        <h1 class="text-3xl text-center pt-8">Página não encontrada</h1>
        <button class="btn btn-secondary inline-block mt-8" @click="router.back()">Voltar</button>
    </div>
</template>
