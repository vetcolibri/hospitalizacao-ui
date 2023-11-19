<script lang="ts" setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
</script>
<template>
    <Header title="Exame Estado Geral">
        <GoBack />
    </Header>
    <main class="main-content">
        <nav class="flex items-center justify-center h-full">
            <ul class="flex flex-col gap-4 w-full lg:max-w-lg xl:max-w-xl">
                <router-link :to="{ name: 'ChoosePatient', params: { page: 'daily-round' } }">
                    <li class="menu-item">
                        <i class="bi bi-clipboard2-data-fill icon"></i>
                        <span>Ronda diária</span>
                    </li>
                </router-link>
                <router-link :to="{ name: 'ChoosePatient', params: { page: 'choose-parameters' } }">
                    <li class="menu-item">
                        <i class="bi bi-clipboard2-data-fill icon"></i>
                        <span>Monitorização continuada</span>
                    </li>
                </router-link>
                <router-link :to="{ name: 'ChoosePatient', params: { page: 'measurements' } }">
                    <li class="menu-item">
                        <i class="bi bi-clipboard2-pulse-fill icon"></i>
                        <span>Medições</span>
                    </li>
                </router-link>
            </ul>
        </nav>
    </main>
    <Footer />
</template>
