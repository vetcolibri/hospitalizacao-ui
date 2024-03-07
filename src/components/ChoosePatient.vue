<script setup lang="ts">
import PatientHospitalized from '@/components/Patient.vue'

defineProps(['patients'])
</script>
<template>
    <section class="container-patients">
        <PatientHospitalized v-for="patient in patients" :patient="patient" />
    </section>
</template>
