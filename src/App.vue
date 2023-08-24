<script setup lang="ts">
import Alert from './components/Alert.vue';
</script>
<template>
    <div class="bg-gray-300 relative">
        <!-- <Alert 
            comment="Atenção a temperatura do paciente" rate="30 minutos" 
            :parameters="['Temperatura']" 
            class="z-50" 
        /> -->
        <router-view></router-view>
    </div>
</template>