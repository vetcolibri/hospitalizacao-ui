<script lang="ts" setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Notification from '@/components/Notification.vue'
</script>
<template>
    <Header title="Exame Estado Geral" />
    <Notification />
    <main class="main-content">
        <nav class="flex items-center justify-center h-full">
            <ul class="flex flex-col gap-4 w-full lg:max-w-lg xl:max-w-xl">
                <router-link :to="{ name: 'NewHospitalization' }">
                    <li class="menu-item">
                        <i class="bi bi-clipboard2-plus-fill text-3xl text-yellow-500"></i>
                        <span>Nova Hospitalização</span>
                    </li>
                </router-link>
                <router-link :to="{ name: 'ChoosePatient', params: { page: 'daily-round' } }">
                    <li class="menu-item">
                        <i class="bi bi-clipboard2-data-fill text-3xl text-yellow-500"></i>
                        <span>Ronda diária</span>
                    </li>
                </router-link>
                <router-link :to="{ name: 'ChoosePatient', params: { page: 'choose-parameters' } }">
                    <li class="menu-item">
                        <i class="bi bi-clipboard2-data-fill text-3xl text-yellow-500"></i>
                        <span>Monitorização continuada</span>
                    </li>
                </router-link>
                <router-link :to="{ name: 'ChoosePatient', params: { page: 'measurements' } }">
                    <li class="menu-item">
                        <i class="bi bi-clipboard2-pulse-fill text-3xl text-yellow-500"></i>
                        <span>Medições</span>
                    </li>
                </router-link>
            </ul>
        </nav>
    </main>
    <Footer />
</template>
