<script lang="ts" setup>
    import Header from '@/components/Header.vue';
    import Footer from '@/components/Footer.vue';
    import Alert from '@/components/Alert.vue';
</script>
<template>
    <div>
        <Header title="Exame Estado Geral"></Header>
        <main class="main-content">
            <div class="flex flex-col gap-4 items-center justify-center h-full">
                <router-link :to="{name: 'PatientList', params: {examFormat: 'daily-round'}}" class="w-full">
                    <div class="border rounded shadow text-center bg-white p-4">Ronda diária</div>
                </router-link>
                <router-link :to="{name: 'PatientList', params: {examFormat: 'parameters'}}" class="w-full">
                    <div class="border rounded shadow text-center bg-white p-4">Monitorização continuada</div>
                </router-link>
            </div>
            <Alert></Alert>
        </main>
        <Footer />
    </div>
</template>
