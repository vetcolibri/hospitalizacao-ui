<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import Button from '@/components/Button.vue';
import ScheduleTime from '@/components/ScheduleTime.vue';
import RepeatEvery from '@/components/ScheduleRepeatEvery.vue';

import { parameters } from '@/data/parameters';

let selectedParameters = ref<any[]>([])
const scheduleTime = ref<Date>()
const repeatEvery = ref<{}>()
const comments = ref<string>()

function selectParameter(name: string){
    const wasSeleted = selectedParameters.value.find(element => element === name)
    if (!wasSeleted) {
        selectedParameters.value.push(name)
    } else {
       selectedParameters.value = selectedParameters.value.filter(element => element !== name)
    } 
}

function save(){
    console.log(scheduleTime.value, repeatEvery.value, comments.value, selectedParameters.value)
}
</script>
<template>
    <div>
        <Header title="Alerta na monitorização" />
        <main class="main-content py-8">
            <section class="bg-white shadow px-8 py-6">
                <form class="space-y-3">
                    <ScheduleTime v-model="scheduleTime"/>
                    <RepeatEvery v-model="repeatEvery"/>
                    <div class="overflow-y-auto border rounded space-y-2 p-3">
                        <div v-for="parameter in parameters" class="flex items-center">
                            <input 
                                type="checkbox" 
                                class="rounded" 
                                @change="selectParameter(parameter.name)"
                            />
                            <label class="ml-2 block text-gray-900">{{ parameter.title }}</label>
                        </div>
                    </div>
                    <div class="flex flex-col form-control border p-3">
                        <label for="comments">Observações</label>
                        <textarea
                            name="comments" 
                            rows="3"
                            class="border-0 focus:ring-0"
                            v-model="comments"
                        >
                        </textarea>
                    </div>
                </form>
            </section>
        </main>
        <Footer>
            <div class="space-x-3">
                <router-link :to="{name: 'ExamGeneralCondition'}">
                    <Button class="btn-light" title="Cancelar" /> 
                </router-link>
                <Button class="btn-success" title="Salvar" @click="save"/>
            </div>
        </Footer>
    </div>
</template>
