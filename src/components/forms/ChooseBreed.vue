<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

interface Props {
    title: string
    breeds: string[]
    value: string
}

interface Emits {
    (e: 'choose', value: string): void
}

const viewBreeds = ref<boolean>(false)
const query = ref<string>('')
const divElRef = ref()

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const options = computed(() => {
    return props.breeds.filter((b) => b.toLowerCase().includes(query.value.toLowerCase()))
})

function chooseBreeds(breed: string) {
    query.value = ''
    viewBreeds.value = false
    emits('choose', breed)
}

function toggleBreeds() {
    if (props.breeds.length == 0) return
    viewBreeds.value = !viewBreeds.value
}

function hidden(event: Event) {
    if (divElRef.value && !divElRef.value.contains(event.target)) {
        viewBreeds.value = false
        return
    }
}

onMounted(async () => {
    document.addEventListener('click', hidden)
})
</script>
<template>
    <div ref="divElRef" class="relative">
        <input
            type="text"
            class="form-control form-select"
            required
            :value="value"
            :class="{ disabled: breeds.length === 0 }"
            :placeholder="value ? value : title"
        />
        <div
            class="w-full h-full absolute top-0 left-0 p-2 z-20 cursor-pointer"
            @click="toggleBreeds()"
        ></div>
        <div v-if="viewBreeds" class="dropdown h-56 space-y-2">
            <input type="text" class="form-control" v-model="query" placeholder="Pesquisar" />
            <ul>
                <li
                    v-for="breed in options"
                    :key="breed"
                    @click="chooseBreeds(breed)"
                    class="flex items-center gap-2 border-t p-2.5 cursor-pointer hover:bg-gray-50"
                >
                    <span>{{ breed }}</span>
                </li>
                <li v-if="breeds.length === 0" class="p-2.5">Nenhum resultado encontrado.</li>
            </ul>
        </div>
    </div>
</template>
