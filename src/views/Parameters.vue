<script setup lang="ts">
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import ExameTime from '@/components/ExameTime.vue';
import SaveButton from '@/components/Button.vue';
import ParameterList from '@/components/ExamParameterList.vue';

import SearchIcon from "vue-material-design-icons/Magnify.vue"

import { makeToday, makeHour } from "@/utils/tools"
import { ref } from 'vue';

const today = makeToday()
const hour = makeHour()

const showParametersList = ref(false)

function toogleParameterList(evt: MouseEvent){
    showParametersList.value = !showParametersList.value;
}

</script>

<template>
    <Header title="Parâmetros" />
    <main class="main-content py-8">
        <section class="bg-white shadow px-8 py-6 space-y-3">
            <ExameTime :today="today" :hour="hour" />
            <div class="relative space-y-2">
                <div class="flex items-center gap-2 border rounded ps-2"                    >
                    <search-icon class="text-gray-400"></search-icon>
                    <input 
                        class="form-contral flex-1 border-0 px-0 focus:ring-0" 
                        type="text" 
                        placeholder="Escolha o parâmetro"
                        @click="(evt) => toogleParameterList(evt)"
                    />
                </div>
                <ParameterList 
                    class="h-48 absolute w-full bg-white"
                    :class="{hidden: !showParametersList}"
                />
            </div>
        </section>
    </main>
    <Footer>
        <SaveButton class="btn-success" title="Salvar" />
    </Footer>
</template>