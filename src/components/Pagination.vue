<script setup lang="ts">
interface Props {
    pages: number
    currentPage: number
}

interface Emits {
    (event: 'updatePage', value: number): void
}

function previusPage() {
    if (props.currentPage > 1) {
        emits('updatePage', props.currentPage - 1)
    }
}

function nexPage() {
    if (props.currentPage < props.pages) {
        emits('updatePage', props.currentPage + 1)
    }
}

const emits = defineEmits<Emits>()
const props = defineProps<Props>()
</script>

<template>
    <nav class="text-center">
        <ul class="inline-flex -space-x-px text-base h-10">
            <li>
                <a
                    href="#"
                    class="flex items-center justify-center px-4 h-10 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100"
                    @click="previusPage"
                >
                    <i class="bi bi-caret-left-fill"></i>
                </a>
            </li>
            <li v-for="page in pages">
                <a
                    href="#"
                    class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100"
                    @click="$emit('updatePage', page)"
                    >{{ page }}</a
                >
            </li>

            <li>
                <a
                    href="#"
                    class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100"
                    @click="nexPage"
                >
                    <i class="bi bi-caret-right-fill"></i>
                </a>
            </li>
        </ul>
    </nav>
</template>
