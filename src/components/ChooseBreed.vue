<script lang="ts" setup>
import { BREEDS } from '@/lib/data/breeds'
import { computed, onMounted, ref } from 'vue'

interface Props {
    title: string
    specie: string
}

interface Emits {
    (e: 'update:modelValue', value: string): void
}

const selectedOption = ref<string>('')
const showOptions = ref<boolean>(false)
const query = ref<string>('')
const breedOptionsRef = ref()

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const searchOptions = computed(() => {
    const breeds = findBreed(props.specie)
    return breeds.filter((option) => option.toLowerCase().startsWith(query.value.toLowerCase()))
})

function toggleOptions() {
    if (!props.specie) return
    showOptions.value = !showOptions.value
}

function select(idx: number) {
    const option = searchOptions.value[idx]
    selectedOption.value = option
    emits('update:modelValue', selectedOption.value)
}

function hidden(event: Event) {
    if (breedOptionsRef.value && !breedOptionsRef.value.contains(event.target)) {
        showOptions.value = false
        return
    }
}

function findBreed(specie: string) {
    switch (specie) {
        case 'CANINO':
            return BREEDS.caes
        case 'FELINO':
            return BREEDS.gatos
        case 'AVES':
            return BREEDS.aves
        case 'EXOTICO':
            return BREEDS.mamiferos
        case 'EXOTICO - MACACO':
            return BREEDS.mamiferos
        case 'EXOTICO - PAPAGAIO':
            return BREEDS.aves
        case 'EXOTICO - RÉPTIL':
            return BREEDS.repteis
        default:
            return []
    }
}

onMounted(async () => {
    document.addEventListener('click', hidden)
})
</script>
<template>
    <div ref="breedOptionsRef" class="relative">
        <input
            type="text"
            class="form-control form-select z-10"
            required
            v-model="selectedOption"
            :class="{ disabled: !specie }"
            :placeholder="title"
        />

        <div
            class="w-full h-full absolute top-0 left-0 p-2 z-20 bg-transparent cursor-pointer"
            @click="toggleOptions()"
        ></div>
        <div v-if="showOptions" class="dropdown h-48 space-y-2">
            <input type="text" class="form-control" v-model="query" placeholder="Pesquisar" />
            <ul>
                <li
                    v-for="(option, idx) in searchOptions"
                    :key="option"
                    class="flex items-center gap-2 border-t p-2.5 cursor-pointer hover:bg-gray-50"
                    @click="select(idx)"
                >
                    <span>{{ option }}</span>
                </li>
                <li v-if="searchOptions.length === 0" class="p-2.5">
                    Nenhum resultado encontrado.
                </li>
            </ul>
        </div>
    </div>
</template>
