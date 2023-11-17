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

const inputRef = ref<HTMLInputElement>()
const selected = ref<string[]>([])
const show = ref<boolean>(false)
const query = ref<string>('')
const optionsRef = ref()

const search = computed(() => {
    return props.options.filter((option) =>
        option.toLowerCase().includes(query.value.toLowerCase())
    )
})

function toggle() {
    show.value = !show.value
}

function select(idx: number) {
    const option = search.value[idx]

    if (selected.value.includes(option)) {
        selected.value = selected.value.filter((selected) => selected !== option)
        emits('update:modelValue', selected.value)
        if (selected.value.length === 0) {
            inputRef.value!.value = ''
        }
        return
    }

    if (props.modelValue.length === props.limit) return

    inputRef.value!.value = '  '
    selected.value.push(option)
    emits('update:modelValue', selected.value)
}

function hasSelected(idx: number) {
    return selected.value.includes(search.value[idx])
}

function cleanSelected() {
    selected.value = []
    inputRef.value!.value = ''
    emits('update:modelValue', selected.value)
}

function hidden(event: Event) {
    if (optionsRef.value && !optionsRef.value.contains(event.target)) {
        show.value = false
    }
}

onMounted(async () => {
    document.addEventListener('click', hidden)
})
</script>
<template>
    <div ref="optionsRef" class="relative">
        <div
            class="w-full h-full absolute top-0 left-0 p-2 z-20 bg-transparent cursor-pointer"
            @click="toggle()"
        >
            <span v-if="modelValue.length > 3">
                {{ `(${modelValue.length})` }} opções escolhidas
            </span>
            <div class="" v-if="modelValue.length > 0 && modelValue.length <= 3">
                <span v-for="option in modelValue" class="badge badge-dark mr-2">
                    {{ option }}
                </span>
            </div>
        </div>
        <input ref="inputRef" type="text" class="form-control z-10" required :placeholder="title" />
        <div
            v-if="show"
            class="w-full h-48 absolute border rounded shadow-sm mt-2 p-2.5 border-gray-300 bg-white overflow-y-auto z-50 text-sm text-gray-500"
        >
            <input type="text" class="form-control mb-2" placeholder="Pesquisar" v-model="query" />
            <div v-if="modelValue.length > 0" class="flex justify-between">
                <span>São permitidas no máximo {{ limit }} opções</span>
                <div class="space-x-1 cursor-pointer" @click="cleanSelected()">
                    <i class="bi bi-trash"></i>
                    <span>Limpar</span>
                </div>
            </div>
            <ul class="mt-2">
                <li
                    v-for="(option, idx) in search"
                    class="flex items-center gap-2 border-t p-2.5 cursor-pointer hover:bg-gray-50"
                    @click="select(idx)"
                >
                    <input type="checkbox" :checked="hasSelected(idx)" />
                    <span>{{ option }}</span>
                </li>
                <li v-if="search.length === 0" class="p-2.5">Nenhum resultado encontrado.</li>
            </ul>
        </div>
    </div>
</template>
