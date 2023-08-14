<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import SaveButton from '@/components/Button.vue';
import ParameterInput from '@/components/ExamParameterInput.vue';
import ParameterSelect from '@/components/ExamParameterSelect.vue';
import ExameTime from '@/components/ExameTime.vue';

import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue';

import { makeToday, makeHour } from "@/utils/tools"

const today = makeToday()
const hour = makeHour()

</script>
<template>
    <div>
        <Header title="Ronda diária">
            <router-link :to="{name: 'PatientList', params: {examFormat: 'daily-round'}}">
                <arrow-left />
            </router-link>
        </Header>
        <main class="main-content py-8">
            <section class="bg-white shadow px-8 py-6">
                <ExameTime :today="today" :hour="hour" />
                <form action="." class="grid grid-row-1 space-y-4">
                    <ParameterInput title="Frequência Cardiaca" name="heartRate" helpText="(70 - 120) BPM"/>
                    <ParameterInput title="Frequência Respiratória" name="respiratoryRate" helpText="(10 - 30) RPM"/>
                    <ParameterInput title="TRC" name="trc" helpText="(> 2')"/>
                    <ParameterSelect title="Mucosas" name="mucosas"/>
                    <ParameterSelect title="AVDN" name="avdn"/>
                    <ParameterInput title="Temperatura" name="temperature" helpText="(37.5 - 39) ºC"/>
                    <ParameterInput title="Glicemia" name="glicemia" helpText="(60 - 100) mg/dl"/>
                    <ParameterInput title="Pressão Arteiral (SYS/DIS)" name="bloodPressure" helpText="(11/70 - 12/80) mm/Hg"/>
                    <ParameterInput title="PAM" name="pam" helpText="(60)"/>
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