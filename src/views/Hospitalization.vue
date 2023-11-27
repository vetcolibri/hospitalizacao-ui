<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
</script>

<template>
    <Header title="Hospitalização">
        <GoBack />
    </Header>
    <main class="main-content">
        <nav class="flex items-center justify-center h-full">
            <ul class="flex flex-col gap-4 w-full lg:max-w-lg xl:max-w-xl">
                <router-link :to="{ name: 'RecurringPatient' }">
                    <li class="menu-item">
                        <i class="bi bi-search icon"></i>
                        <span>Pesquisar paciente</span>
                    </li>
                </router-link>
                <router-link :to="{ name: 'RegisterPatient' }">
                    <li class="menu-item">
                        <i class="bi bi-plus-circle-fill icon"></i>
                        <span>Novo paciente</span>
                    </li>
                </router-link>
            </ul>
        </nav>
    </main>
    <Footer />
</template>
