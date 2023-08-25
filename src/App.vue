<script setup lang="ts">
import Alert from './components/Alert.vue';
</script>
<template>
    <div class="bg-gray-300 relative">
        <!-- <Alert
            id="alert-1"
            patientId="some-patient-id"
            repeatEvery="30 minutos" 
            comments="Atenção a temperatura do paciente"
            :parameters="['Temperatura']"
            class="z-50" 
        /> -->
        <router-view></router-view>
    </div>
</template>