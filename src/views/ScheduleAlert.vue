<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'
import ScheduleTime from '@/components/ScheduleTime.vue'
import RepeatEvery from '@/components/ScheduleRepeatEvery.vue'

import { parameters } from '@/lib/data/parameters'
import { useRouter } from 'vue-router'

let selectedParameters = ref<any[]>([])
const scheduleTime = ref<Date>()
const repeatEvery = ref<{}>()
const comments = ref<string>()
const router = useRouter()

function isSeleted(name: string) {
    return selectedParameters.value.find((element) => element === name)
}

function selectParameter(name: string) {
    if (!isSeleted(name)) {
        return selectedParameters.value.push(name)
    }
    return (selectedParameters.value = selectedParameters.value.filter(
        (element) => element !== name
    ))
}

function schedule() {
    if (selectedParameters.value.length === 0) {
        return alert('Selecione pelo menos um parâmetro para monitorar')
    }
    alert('Alerta agendado com sucesso')
    return router.push({ name: 'ExamGeneralCondition' })
}
</script>
<template>
    <div>
        <Header title="Alerta na monitorização" />
        <main class="main-content py-8">
            <section class="bg-white shadow px-8 py-6">
                <form class="space-y-3">
                    <ScheduleTime v-model="scheduleTime" />
                    <RepeatEvery v-model="repeatEvery" />
                    <div class="overflow-y-auto border rounded space-y-2 p-3">
                        <div v-for="parameter in parameters" class="flex items-center">
                            <input
                                type="checkbox"
                                class="rounded focus:ring-0"
                                :name="parameter.name"
                                @change="selectParameter(parameter.name)"
                                :checked="isSeleted(parameter.name)"
                            />
                            <label
                                class="ml-2 block text-gray-900"
                                @click="selectParameter(parameter.name)"
                            >
                                {{ parameter.title }}
                            </label>
                        </div>
                    </div>
                    <textarea
                        name="comments"
                        class="form-control resize-none focus:ring-0 overflow-hidden"
                        placeholder="Observações"
                        rows="4"
                        v-model="comments"
                    >
                    </textarea>
                </form>
            </section>
        </main>
        <Footer>
            <div class="space-x-3">
                <router-link :to="{ name: 'ExamGeneralCondition' }">
                    <Button class="btn-light" title="Cancelar" />
                </router-link>
                <Button class="btn-success" title="Agendar" @click="schedule" />
            </div>
        </Footer>
    </div>
</template>
