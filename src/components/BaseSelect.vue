<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

interface Props {
    title: string
    options: string[]
    limit: number
    modelValue: string[]
}

interface Emits {
    (e: 'update:modelValue', value: string[]): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const query = ref<string>('')
const showOptions = ref<boolean>(false)
const selectedOptions = ref<string[]>([])
const inputRef = ref<HTMLInputElement>()
const optionsRef = ref()

function toggleOptions() {
    showOptions.value = !showOptions.value
}

function selectOption(idx: number) {
    const option = searchOptions.value[idx]

    if (selectedOptions.value.includes(option)) {
        selectedOptions.value = selectedOptions.value.filter((selected) => selected !== option)
        emits('update:modelValue', selectedOptions.value)
        if (selectedOptions.value.length === 0) {
            inputRef.value!.value = ''
        }
        return
    }

    if (props.modelValue.length === props.limit) return

    inputRef.value!.value = '1'
    selectedOptions.value.push(option)
    emits('update:modelValue', selectedOptions.value)
}

function hasSelected(idx: number) {
    return selectedOptions.value.includes(searchOptions.value[idx])
}

function cleanSelectedOptions() {
    selectedOptions.value = []
    inputRef.value!.value = ''
    emits('update:modelValue', selectedOptions.value)
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
        <div
            class="cursor-pointer z-20 absolute w-full h-full top-0 left-0 bg-transparent p-2"
            @click="toggleOptions()"
        >
            <span v-if="modelValue.length > 5">
                {{ `(${modelValue.length})` }} opções escolhidas
            </span>
            <div class="" v-if="modelValue.length > 0 && modelValue.length <= 5">
                <span v-for="option in modelValue" class="badge badge-dark mr-2">
                    {{ option }}
                </span>
            </div>
        </div>
        <input ref="inputRef" type="text" class="form-control z-10" required :placeholder="title" />
        <div
            v-if="showOptions"
            class="w-full h-48 absolute border rounded shadow-sm mt-2 p-2.5 border-gray-300 bg-white overflow-y-auto z-50 text-sm text-gray-500"
        >
            <input type="text" class="form-control mb-2" placeholder="Pesquisar" v-model="query" />
            <div v-if="modelValue.length > 0" class="flex justify-between">
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
