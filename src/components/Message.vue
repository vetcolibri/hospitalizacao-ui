<script setup lang="ts">
import { ref } from 'vue'

const sectionRef = ref<HTMLElement>()
const messages = ref<string[]>([])
const visible = ref<boolean>(false)

function addMessage(message: string) {
    messages.value = []
    messages.value.push(message)
    visible.value = true
}

function close() {
    messages.value = []
    visible.value = false
}

defineExpose({ add: addMessage })
</script>
<template>
    <section
        ref="sectionRef"
        v-show="visible"
        class="w-full lg:max-w-3xl lg:mx-auto bg-white p-2.5 shadow rounded mt-4 border-0 border-l-4 border-red-500"
    >
        <div class="flex items-center">
            <ul class="flex-1 list-disc ml-6 text-sm space-y-1 text-red-500">
                <li v-for="message in messages">{{ message }}</li>
            </ul>
            <i class="bi bi-x-lg self-start cursor-pointer" @click="close()"></i>
        </div>
    </section>
</template>
