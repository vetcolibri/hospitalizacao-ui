<script setup lang="ts">
import { useAuth, getUser } from '@/composables/useAuth';
import { version } from '@/version';
const auth = useAuth();

const logout = () => {
    auth.logout();
};

defineProps(['title']);
</script>
<template>
    <header class="flex items-center h-16 shadow-md bg-white">
        <div class="main-content flex flex-1">
            <div class="flex flex-1 items-center gap-1">
                <slot></slot>
                <h1 class="font-medium">{{ title }}</h1>
            </div>
            <div class="flex flex-1 items-center text-gray-700">
                <span> {{ version }} </span>
            </div>
            <div class="flex items-center space-x-2 text-gray-700">
                <span>{{ getUser() }}</span>
                <i class="bi bi-box-arrow-right cursor-pointer md:text-xl" @click="logout()"></i>
            </div>
        </div>
    </header>
</template>
