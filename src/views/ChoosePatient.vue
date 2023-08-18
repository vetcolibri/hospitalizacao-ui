<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Patient from '@/components/Patient.vue'

import GoBack from '@/components/GoBack.vue'

import PATIENTS from '@/data/patients'

</script>
<template>
    <div>
        <Header title="Escolha o paciente">
            <GoBack />
        </Header>
        <main class="main-content py-8">
            <section class="xl:grid xl:grid-cols-3 xl:justify-center xl:gap-3">
                <Patient  
                    v-for="patient in PATIENTS" 
                    :id="patient.id" 
                    :name="patient.name" 
                    :specie="patient.specie"
                    :icon-url="patient.iconUrl"
                    :alerts="patient.alerts"
                    class="xl:w-[600px]"
                />
            </section>
        </main>
        <Footer />
    </div>
</template>