<script setup lang="ts">
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import SaveButton from '@/components/Button.vue';
import ExameTime from '@/components/ExameTime.vue';
import ExamParameterInput from '@/components/ExamParameterInput.vue';
import ExamParameterSelect from '@/components/ExamParameterSelect.vue';

// import ParameterList from '@/components/ExamParameterList.vue';  
import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue';
import SearchIcon from 'vue-material-design-icons/Magnify.vue';

import { makeToday, makeHour } from "@/utils/tools"
import { ref } from 'vue';

const today = makeToday()
const hour = makeHour()

const showParametersList = ref(false)
const heartRate = ref(false)
const respiratoryRate = ref(false)
const trc = ref(false)
const mucosas = ref(false)
const avdn = ref(false)
const temperature = ref(false)
const glicemia = ref(false)
const bloodPressure = ref(false)
const pam = ref(false)

function changeVisibiliy(param: string){
    if (param === '1'){
        heartRate.value = !heartRate.value
    }
    if (param === '2'){
        respiratoryRate.value = !respiratoryRate.value
    }
    if (param === '3'){
        trc.value = !trc.value
    }
    if (param === '4'){
        mucosas.value = !mucosas.value
    }
    if (param === '5'){
        avdn.value = !avdn.value
    }
    if (param === '6'){
        temperature.value = !temperature.value
    }
    if (param === '7'){
        glicemia.value = !glicemia.value
    }
    if (param === '8'){
        bloodPressure.value = !bloodPressure.value
    }
    if (param === '9'){
        pam.value = !pam.value
    }
}       

function toogleParameterList(){
    showParametersList.value = !showParametersList.value;
}

</script>

<template>
    <Header title="Parâmetros">
        <router-link :to="{name: 'PatientList', params: {examFormat: 'parameters'}}">
            <arrow-left />
        </router-link>
    </Header>
    <main class="main-content py-8">
        <section class="bg-white shadow px-8 py-6 space-y-3">
            <ExameTime :today="today" :hour="hour" />
            <div class="relative space-y-2">
                <div class="flex items-center gap-2 border rounded ps-2">
                    <search-icon class="text-gray-400"></search-icon>
                    <input 
                        class="form-contral flex-1 border-0 px-0 focus:ring-0" 
                        type="text" 
                        placeholder="Escolha o parâmetro"
                        @click="toogleParameterList"
                    />
                </div>
                <!-- <ParameterList 
                    class="h-48 absolute w-full bg-white"
                    :class="{hidden: !showParametersList}"
                /> -->
                <div 
                    class="h-48 absolute w-full bg-white overflow-y-auto border rounded space-y-2 p-3" 
                    :class="{hidden: !showParametersList}">
                    <div class="flex items-center">
                        <input type="checkbox" class="rounded" @change="changeVisibiliy('1')">
                        <label class="ml-2 block text-gray-900">Frequência Cardiaca</label>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" class="rounded" @change="changeVisibiliy('2')">
                        <label class="ml-2 block text-gray-900">Frequência Respiratória</label>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" class="rounded" @change="changeVisibiliy('3')">
                        <label class="ml-2 block text-gray-900">TRC</label>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" class="rounded" @change="changeVisibiliy('4')">
                        <label class="ml-2 block text-gray-900">Mucosas</label>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" class="rounded" @change="changeVisibiliy('5')">
                        <label class="ml-2 block text-gray-900">AVDN</label>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" class="rounded" @change="changeVisibiliy('6')">
                        <label class="ml-2 block text-gray-900">Temperatura</label>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" class="rounded" @change="changeVisibiliy('7')">
                        <label class="ml-2 block text-gray-900">Glicemia</label>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" class="rounded" @change="changeVisibiliy('8')">
                        <label class="ml-2 block text-gray-900">Pressão Arterial</label>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" class="rounded" @change="changeVisibiliy('9')">
                        <label class="ml-2 block text-gray-900">PAM</label>
                    </div>
                </div>
                <hr>
                <form id="parametersContainer" method="POST">
                    <ExamParameterInput v-if="heartRate" title="Frequência Cardiaca" name="heartRate"/>
                    <ExamParameterInput v-if="respiratoryRate" title="Frequência Respiratória" name="respiratoryRate"/>
                    <ExamParameterInput v-if="trc" title="TRC" name="trc" helpText="(> 2')"/>
                    <ExamParameterSelect v-if="mucosas"  title="Mucosas" name="mucosas"/>
                    <ExamParameterSelect v-if="avdn"  title="AVDN" name="avdn"/>
                    <ExamParameterInput v-if="temperature" title="Temperatura" name="temperature" helpText="(37.5 - 39) ºC"/>
                    <ExamParameterInput v-if="glicemia" title="Glicemia" name="glicemia" helpText="(60 - 100) mg/dl"/>
                    <ExamParameterInput v-if="bloodPressure" title="Pressão Arteiral (SYS/DIS)" name="bloodPressure" helpText="(11/70 - 12/80) mm/Hg"/>
                    <ExamParameterInput v-if="pam" title="PAM" name="pam" helpText="(60)"/>
                </form>
            </div>
        </section>
    </main>
    <Footer>
        <SaveButton class="btn-success" title="Salvar" />
    </Footer>
</template>