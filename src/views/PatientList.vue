<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Patient from '@/components/Patient.vue'

import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue';
</script>
<template>
    <div>
        <Header title="Selecionar paciente">
            <router-link to="/"><arrow-left/></router-link>
        </Header>
        <main class="main-content py-8">
            <Patient patientId="P/1001-maximus" name="Max" specie="Bullgog"></Patient>
        </main>
        <Footer />
    </div>
</template>