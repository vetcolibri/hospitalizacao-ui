<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
    <Header title="Dashboard" />
    <main class="main-content px-12">
        <nav class="flex items-center justify-center h-full">
            <ul class="flex flex-col gap-4 w-full lg:max-w-lg xl:max-w-xl">
                <router-link :to="{ name: 'Hospitalization' }">
                    <li class="menu-item">
                        <i class="bi bi-hospital-fill text-sm md:text-2xl text-yellow-500"></i>
                        <span>Hospitalização</span>
                    </li>
                </router-link>
                <router-link :to="{ name: 'ExamGeneralCondition' }">
                    <li class="menu-item">
                        <i
                            class="bi bi-clipboard2-data-fill text-sm md:text-2xl text-yellow-500"
                        ></i>
                        <span>Exame Estado Geral</span>
                    </li>
                </router-link>
            </ul>
        </nav>
    </main>
    <Footer />
</template>
