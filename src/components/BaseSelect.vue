<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

interface Props {
    title: string
    options: string[]
    limit: number
    search: boolean
}

interface Emits {
    (e: 'update:modelValue', value: string[]): void
}

const inputRef = ref<HTMLInputElement>()
const selectedOptions = ref<string[]>([])
const showOptions = ref<boolean>(false)
const breed = ref<string>('')
const optionsRef = ref()

const props = withDefaults(defineProps<Props>(), {
    search: true
})
const emits = defineEmits<Emits>()

const searchOptions = computed(() => {
    return props.options.filter((option) =>
        option.toLowerCase().startsWith(breed.value.toLowerCase())
    )
})

function toggleOptions() {
    showOptions.value = !showOptions.value
}

function select(idx: number) {
    const option = searchOptions.value[idx]

    if (selectedOptions.value.includes(option)) {
        selectedOptions.value = selectedOptions.value.filter(
            (selectedOption) => selectedOption !== option
        )
        emits('update:modelValue', selectedOptions.value)
        clearView()
        return
    }

    const isLimit = reachedTheLimit()
    if (isLimit) return

    inputRef.value!.value = '  '
    selectedOptions.value.push(option)
    emits('update:modelValue', selectedOptions.value)
}

function reachedTheLimit() {
    return selectedOptions.value.length === props.limit
}

function clearView() {
    if (selectedOptions.value.length !== 0) return
    inputRef.value!.value = ''
}

function hasSelected(idx: number) {
    return selectedOptions.value.includes(searchOptions.value[idx])
}

function clearSelectedOptions() {
    selectedOptions.value = []
    inputRef.value!.value = ''
    emits('update:modelValue', selectedOptions.value)
}

function hidden(event: Event) {
    if (optionsRef.value && optionsRef.value.contains(event.target)) return
    showOptions.value = false
}

function clear() {
    selectedOptions.value = []
    inputRef.value!.value = ''
}

defineExpose({ clear })

onMounted(async () => {
    document.addEventListener('click', hidden)
})
</script>
<template>
    <div ref="optionsRef" class="relative">
        <div
            class="w-full h-full absolute top-0 left-0 p-2 z-20 bg-transparent cursor-pointer"
            @click="toggleOptions()"
        >
            <span v-if="selectedOptions.length > 3">
                {{ `(${selectedOptions.length})` }} opções escolhidas
            </span>
            <div v-if="selectedOptions.length <= 3">
                <span v-for="option in selectedOptions" class="badge badge-dark mr-2">
                    {{ option }}
                </span>
            </div>
        </div>

        <input
            ref="inputRef"
            type="text"
            class="form-control form-select z-10 pointer-events-none"
            required
            :placeholder="title"
        />

        <div v-if="showOptions" class="dropdown h-48 space-y-2">
            <input
                v-if="search"
                type="text"
                class="form-control"
                v-model="breed"
                placeholder="Pesquisar"
            />

            <div v-if="limit > 1" class="flex justify-between">
                <span class="text-xs">São permitidas no máximo {{ limit }} opções</span>
                <div class="space-x-1 cursor-pointer" @click="clearSelectedOptions()">
                    <i class="bi bi-trash"></i>
                    <span class="text-xs">Limpar</span>
                </div>
            </div>

            <ul>
                <li
                    v-for="(option, idx) in searchOptions"
                    :key="option"
                    class="flex items-center gap-2 border-t p-2.5 cursor-pointer hover:bg-gray-50"
                    @click="select(idx)"
                >
                    <input type="checkbox" :checked="hasSelected(idx)" />
                    <span>{{ option }}</span>
                </li>
                <li v-if="searchOptions.length === 0" class="p-2.5">
                    Nenhum resultado encontrado.
                </li>
            </ul>
        </div>
    </div>
</template>
