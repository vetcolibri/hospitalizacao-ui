<script setup lang="ts">
import AlertIcon from '@/components/icons/AlertIcon.vue'
import CheckCircle from '@/components/icons/CheckCircle.vue'
import { Parameter } from '@/lib/types'
import { ref } from 'vue'
import { parameters } from '@/lib/data/parameters'

const dialogElement = ref<HTMLDialogElement>()
const dialogParameters = ref<Partial<Parameter>[]>([])

function addParameters(parameters: Partial<Parameter>[]) {
    parameters.forEach((parameter) => add(parameter))
}

function add(parameter: Partial<Parameter>) {
    if (parameter.name != parameters.avdn.name && parameter.name != parameters.mucosas.name) {
        dialogParameters.value.push(parameter)
    }
}

function show() {
    dialogElement.value?.showModal()
}

function close() {
    dialogParameters.value = []
    dialogElement.value?.close()
}

defineProps(['title'])
defineExpose({ addParameters, add, show, close })
</script>
<template>
    <dialog ref="dialogElement">
        <div class="w-96 lg:w-11/12 3xl:w-1/2 mx-auto border rounded bg-white p-3">
            <h1 class="font-medium text-center uppercase">{{ title }}</h1>
            <div class="space-y-3 mt-4">
                <ul class="mx-4 space-y-2">
                    <li
                        v-for="parameter in dialogParameters"
                        class="w-full flex items-center gap-2"
                    >
                        <span
                            v-if="parameter?.measurement?.message"
                            class="flex gap-2 text-red-500"
                        >
                            <alert-icon
                                class="text-yellow-600"
                                v-show="parameter.measurement?.message ? true : false"
                            />
                            {{ parameter?.title }}:
                            {{ parameter?.measurement?.message }}
                        </span>
                        <span
                            v-else="parameter?.measurement?.message"
                            class="flex gap-2 text-gray-500"
                        >
                            <check-circle
                                class="text-green-600"
                                v-show="parameter.measurement?.message ? false : true"
                            />
                            {{ parameter?.title }}: Normal
                        </span>
                    </li>
                </ul>
            </div>
            <div class="text-right mt-8 space-y-2 space-x-2">
                <button class="btn-light" @click="close()">Fechar</button>
                <slot></slot>
            </div>
        </div>
    </dialog>
</template>
