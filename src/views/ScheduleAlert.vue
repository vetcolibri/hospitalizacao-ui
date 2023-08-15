<script setup lang="ts">
    import { ref } from 'vue'
    import Header from '@/components/Header.vue';
    import Footer from '@/components/Footer.vue';
    import Button from '@/components/Button.vue';
    import ScheduleTime from '@/components/ScheduleTime.vue';
    import ParameterList from '@/components/ExamParameterList.vue';
    import RateFrequency from '@/components/RateFrequency.vue';

    import { makeHour } from '@/utils/tools';
    
    const time = ref()
    time.value = makeHour()

</script>
<template>
    <div>
        <Header title="Alerta na monitorização" />
        <main class="main-content py-8">
            <section class="bg-white shadow px-8 py-6">
                <form action="." class="space-y-3">
                    <ScheduleTime :time=time />
                    <RateFrequency />
                    <ParameterList />
                    <div class="flex flex-col form-control border p-3">
                        <label for="comments">Observações</label>
                        <textarea class="border-0 focus:ring-0" name="comments" rows="3">
                        </textarea>
                    </div>
                </form>
            </section>
        </main>
        <Footer>
            <div class="space-x-3">
                <router-link :to="{name: 'ExamMenu'}">
                    <Button class="btn-light" title="Cancelar" /> 
                </router-link>
                <Button class="btn-success" title="Salvar"/>
            </div>
        </Footer>
    </div>
</template>
