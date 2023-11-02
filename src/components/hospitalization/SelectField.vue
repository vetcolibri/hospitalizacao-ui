<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

export interface Props {
    title: string
    options: string[]
    limit: number
}

interface Emits {
    (e: 'update:modelValue', value: string[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const query = ref<string>('')
const showOptions = ref<boolean>(false)
const selectedOptions = ref<string[]>([])
const optionsRef = ref()

function toggleOptions() {
    showOptions.value = !showOptions.value
}

function selectOption(idx: number) {
    const option = searchOptions.value[idx]
    if (selectedOptions.value.includes(option)) {
        selectedOptions.value = selectedOptions.value.filter((selected) => selected !== option)
        emit('update:modelValue', selectedOptions.value)
        return
    }
    if (selectedOptions.value.length === props.limit) {
        return
    }
    selectedOptions.value.push(option)
    emit('update:modelValue', selectedOptions.value)
}

function hasSelected(idx: number) {
    return selectedOptions.value.includes(searchOptions.value[idx])
}

function cleanSelectedOptions() {
    selectedOptions.value = []
}

function hiddenOptions(event: Event) {
    if (optionsRef.value && !optionsRef.value.contains(event.target)) {
        showOptions.value = false
    }
}

const searchOptions = computed(() => {
    return props.options.filter((option) =>
        option.toLowerCase().includes(query.value.toLowerCase())
    )
})

onMounted(async () => {
    document.addEventListener('click', hiddenOptions)
})
</script>
<template>
    <div ref="optionsRef" class="relative">
        <div class="form-control form-select text-gray-500 cursor-pointer" @click="toggleOptions()">
            <span v-if="selectedOptions.length === 0">
                {{ title }}
            </span>
            <span v-if="selectedOptions.length > 5"
                >{{ `(${selectedOptions.length})` }} opções escolhidas</span
            >
            <span
                v-else
                v-for="option in selectedOptions"
                class="inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-gray-800 bg-gray-100 rounded"
            >
                {{ option }}
            </span>
        </div>
        <div
            v-if="showOptions"
            class="w-full h-48 absolute border rounded shadow-sm mt-2 p-2.5 border-gray-300 bg-white overflow-y-auto z-50 text-sm text-gray-500"
        >
            <input type="text" class="form-control mb-2" placeholder="Pesquisar" v-model="query" />
            <div v-if="selectedOptions.length > 0" class="flex justify-between">
                <span>São permitidas no máximo {{ limit }} opções</span>
                <div class="space-x-1 cursor-pointer" @click="cleanSelectedOptions()">
                    <i class="bi bi-trash"></i>
                    <span>Limpar</span>
                </div>
            </div>
            <ul class="mt-2">
                <li
                    v-for="(option, idx) in searchOptions"
                    class="flex items-center gap-2 border-t p-2.5 cursor-pointer hover:bg-gray-50"
                    @click="selectOption(idx)"
                >
                    <input type="checkbox" :checked="hasSelected(idx)" />
                    <span>{{ option }}</span>
                </li>
                <li class="p-2.5" v-if="searchOptions.length === 0">
                    Nenhum resultado encontrado.
                </li>
            </ul>
        </div>
    </div>
</template>
