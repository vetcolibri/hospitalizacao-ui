<script setup lang="ts">
import Footer from '@/components/Footer.vue'
import { ref } from 'vue'

const menu = ref<boolean>(false)

function toggleMenu() {
    menu.value = !menu.value
}

function openMenu() {
    menu.value = true
}

function closeMenu() {
    menu.value = false
}
</script>

<template>
    <div
        class="absolute w-full bottom-0 lg:w-56 lg:bottom-24 lg:right-10 text-center"
        @mouseleave="closeMenu()"
        @mouseenter="openMenu()"
    >
        <ul class="flex flex-col gap-4 mb-4" v-show="menu">
            <router-link :to="{ name: 'RegisterPatient' }">
                <li class="menu-item w-56 mx-auto lg:w-full lg:mx-0">
                    <i class="bi bi-hospital-fill text-3xl icon"></i>
                    <span>Novo paciente</span>
                </li>
            </router-link>

            <router-link :to="{ name: 'RecurringPatient' }">
                <li class="menu-item w-56 mx-auto lg:w-full lg:mx-0">
                    <i class="bi bi-clipboard-fill text-3xl icon"></i>
                    <span>Nova hospitalização</span>
                </li>
            </router-link>
        </ul>
        <button
            class="w-14 h-14 bi bi-plus text-5xl rounded-full text-white bg-yellow-500 mb-1"
            @click="toggleMenu()"
        ></button>
    </div>

    <Footer />
</template>
