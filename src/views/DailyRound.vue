<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue';
import SaveButton from '@/components/Button.vue';
import Parameter from '@/components/ExamParameter.vue';
import ExamTime from '@/components/ExamTime.vue';

import { makeToday, makeHour } from "@/utils/tools"

const today = makeToday()
const hour = makeHour()

</script>
<template>
    <div>
        <Header title="Ronda diária">
            <GoBack />
        </Header>
        <main class="main-content py-8">
            <section class="bg-white shadow px-8 py-6">
                <ExamTime :today="today" :hour="hour" />
                <form action="." class="grid grid-row-1 space-y-4">
                    <Parameter title="Frequência Cardiaca" name="heartRate" helpText="(70 - 120) BPM" />                    
                    <Parameter title="Frequência Respiratória" name="respiratoryRate" helpText="(10 - 30) RPM"/>
                    <Parameter title="TRC" name="trc" helpText="(> 2')"/>
                    <Parameter title="Mucosas" name="mucosas" :isCombox="true"/>
                    <Parameter title="AVDN" name="avdn" :isCombox="true"/>
                    <Parameter title="Temperatura" name="temperature" helpText="(37.5 - 39) ºC"/>
                    <Parameter title="Glicemia" name="glicemia" helpText="(60 - 100) mg/dl"/>
                    <Parameter title="Pressão Arteiral (SYS/DIS)" name="bloodPressure" helpText="(11/70 - 12/80) mm/Hg" type="text"/>
                    <Parameter title="PAM" name="pam" helpText="(60)"/>
                    <div class="flex items-center">
                        <input type="checkbox" name="createAlert" id="createAlertId" class="rounded">
                        <label for="create-alert" class="ml-2 block text-gray-900">Criar alerta de monitorização</label>
                    </div>
                </form>
            </section>
        </main>
        <Footer>
            <router-link :to="{name: 'ScheduleAlert'}">
                <SaveButton class="btn-success" title="Salvar" />
            </router-link>
        </Footer>
    </div>
</template>