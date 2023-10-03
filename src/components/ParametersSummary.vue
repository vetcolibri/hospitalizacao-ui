<script lang="ts">
import AlertIcon from '@/components/icons/AlertIcon.vue'
import CheckCircle from '@/components/icons/CheckCircle.vue'
import type { Parameter } from '@/models/parameter'

import { ref } from 'vue'
</script>

<script setup lang="ts">
export interface Props {
    name: string
    message: string
}
const summaryEl = ref<HTMLDialogElement>()
const parameters = ref<Props[]>([])

function addParameters() {
    const a = { name: 'TRC', message: '' }
    // parameters.forEach((parameter) => )
    add(a)
    add(a)
    add(a)
}

function add(parameter: Props) {
    parameters.value.push(parameter)
}

function show() {
    summaryEl.value?.showModal()
}

function close() {
    parameters.value = []
    summaryEl.value?.close()
}

defineExpose({ addParameters, add, show, close })
</script>
<template>
    <dialog ref="summaryEl" class="sm:w-96">
        <div class="relative w-full max-w-md max-h-full">
            <div class="relative bg-white rounded-lg shadow">
                <button
                    type="button"
                    @click="close()"
                    class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-200 dark:hover:text-black"
                >
                    <i class="bi bi-x-lg text-lg"></i>
                </button>
                <div class="p-4">
                    <h3 class="font-semibold text-center text-gray-900 lg:text-lg">Resumo</h3>
                </div>
                <div class="p-6">
                    <ul class="my-4 space-y-3">
                        <li
                            v-for="parameter in parameters"
                            class="flex items-center text-base text-gray-900 rounded-lg"
                        >
                            <alert-icon
                                class="text-yellow-600"
                                v-show="parameter.message.length > 1"
                            />
                            <check-circle
                                class="text-green-600"
                                v-show="parameter.message.length === 0"
                            />
                            <span class="flex-1 ml-3 whitespace-nowrap">{{ parameter.name }}:</span>
                            <span
                                class="inline-flex ml-3 px-2 py-0.5 text-sm font-normal"
                                :class="parameter.message ? 'text-red-500' : 'text-gray-500'"
                            >
                                {{ parameter.message ? parameter.message : 'Normal' }}
                            </span>
                        </li>
                    </ul>
                    <div class="text-right">
                        <slot></slot>
                    </div>
                </div>
            </div>
        </div>
    </dialog>
</template>
