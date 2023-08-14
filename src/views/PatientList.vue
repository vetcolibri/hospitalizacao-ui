<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Patient from '@/components/Patient.vue'

import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue';

import PATIENTS from '@/data/patients'

</script>
<template>
    <div>
        <Header title="Selecionar paciente">
            <router-link to="/"><arrow-left/></router-link>
        </Header>
        <main class="main-content py-8">
            <Patient  
                v-for="patient in PATIENTS" 
                :id="patient.id" 
                :name="patient.name" 
                :specie="patient.specie"
            >
            </Patient>
        </main>
        <Footer />
    </div>
</template>