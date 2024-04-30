<script setup lang="ts">
import BaseDialog from '../BaseDialog.vue'
import ParameterStatus from './ParameterStatus.vue'

import type { Parameter } from '@/lib/domain/parameter'
import { ref } from 'vue'

const dialogRef = ref<typeof BaseDialog>()
const parameters = ref()

function open() {
    dialogRef.value?.open()
}

function close() {
    dialogRef.value?.close()
}

function add(params: Parameter[]) {
    parameters.value = []
    parameters.value = params.filter((p) => p.value)
}

defineExpose({ open, close, add })
defineEmits<{ (e: 'save'): void }>()
</script>
<template>
    <BaseDialog ref="dialogRef" title="Resumo">
        <ul class="space-y-4 mb-8">
            <li
                v-for="parameter in parameters"
                :key="parameter.name"
                class="flex items-center justify-between w-full"
            >
                <div v-if="parameter.value" class="space-x-3">
                    <span
                        v-if="parameter.status === 'Normal'"
                        class="bi bi-check-circle-fill text-green-500 md:text-lg"
                    >
                    </span>

                    <span
                        v-if="parameter.status !== 'Normal'"
                        class="bi bi-exclamation-triangle-fill text-yellow-500"
                    >
                    </span>

                    <span>{{ parameter.title }}</span>
                </div>
                <ParameterStatus
                    :value="parameter.value"
                    :status="parameter.status"
                    :colors="parameter?.colors"
                />
            </li>
        </ul>
        <div class="text-right space-x-3">
            <button class="btn btn-success space-x-3 w-full" @click="$emit('save')">
                <span class="font-semibold">Salvar</span>
            </button>
        </div>
    </BaseDialog>
</template>
