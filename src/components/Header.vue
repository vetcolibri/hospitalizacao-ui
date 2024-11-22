<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
const auth = useAuth()

const logout = () => {
    auth.logout()
}

defineProps(['title'])
</script>
<template>
    <header class="flex items-center h-16 shadow-md bg-white">
        <div class="main-content flex flex-1">
            <div class="flex flex-1 items-center gap-1">
                <slot></slot>
                <h1 class="font-medium">{{ title }}</h1>
            </div>
            <div class="flex items-center space-x-2 text-gray-700 cursor-pointer" @click="logout()">
                <i class="bi bi-box-arrow-right md:text-xl"></i>
            </div>
        </div>
    </header>
</template>
