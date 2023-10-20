<script setup lang="ts">
import BaseDialog from '../BaseDialog.vue'
import { ref } from 'vue'
import { Parameter } from '@/models/parameter'

const dialogRef = ref<typeof BaseDialog>()
const parameters = ref<Partial<Parameter[]>>([])

function open() {
    dialogRef.value?.open()
}

function close() {
    dialogRef.value?.close()
}

function addParameters(params: Parameter[]) {
    parameters.value = []
    parameters.value.push(...params)
}

defineExpose({ open, close, addParameters })
</script>
<template>
    <BaseDialog ref="dialogRef" title="Resumo">
        <ul class="space-y-2 mb-4">
            <li v-for="parameter in parameters">
                <div v-if="parameter?.value" class="flex items-center justify-between w-full">
                    <div class="flex items-center gap-2">
                        <i
                            class="bi bi-exclamation-triangle-fill text-base md:text-lg text-yellow-600"
                            v-show="parameter?.state"
                        ></i>
                        <i
                            class="bi bi-check-circle-fill text-base md:text-lg text-green-600"
                            v-show="!parameter?.state"
                        >
                        </i>
                        <span>{{ parameter?.name }}</span>
                    </div>
                    <span
                        class="font-semibold"
                        :class="parameter?.state ? 'text-red-500' : 'text-gray-500'"
                    >
                        {{ parameter?.state ? parameter?.state : 'Normal' }}
                    </span>
                </div>
            </li>
        </ul>
        <div class="text-right space-x-3">
            <slot></slot>
        </div>
    </BaseDialog>
</template>
