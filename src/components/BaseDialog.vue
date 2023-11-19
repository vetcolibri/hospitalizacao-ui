<script setup lang="ts">
import { ref } from 'vue'

interface Props {
    title: string
}

const dialogRef = ref<HTMLDialogElement>()

function open() {
    dialogRef.value?.showModal()
}

function close() {
    dialogRef.value?.close()
}

defineProps<Props>()
defineExpose({ open, close })
</script>
<template>
    <dialog ref="dialogRef" class="w-full md:max-w-md rounded-lg">
        <div class="bg-white shadow">
            <div class="relative w-full max-h-full mx-auto">
                <div class="px-6 py-4 border-b rounded-t">
                    <h3 class="text-xs sm:text-base font-semibold text-gray-900">{{ title }}</h3>
                    <i
                        class="bi bi-x-lg absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                        @click="close"
                    ></i>
                </div>
                <div class="p-6">
                    <slot></slot>
                </div>
            </div>
        </div>
    </dialog>
</template>
