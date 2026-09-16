<script setup lang="ts">
import BaseInput from '@/components/BaseInput.vue'
import { Provided } from '@/lib/provided'
import type { PatientSearchResultModel } from '@/lib/models/patient'
import type { PatientService } from '@/lib/services/patient_service'
import { inject, ref } from 'vue'

/**
 * Pesquisa unificada de pacientes (RF nova hospitalização).
 *
 * Um único termo procura ID paciente, ID tutor, nome paciente e nome tutor.
 * O servidor devolve até 10 por relevância. Resultados já internados são
 * mostrados com o estado mas NÃO seleccionáveis; todos os estados de alta
 * continuam elegíveis.
 */

interface Emits {
    (e: 'select', value: PatientSearchResultModel): void
    (e: 'clear'): void
    (e: 'searching', value: boolean): void
    (e: 'new'): void
}

const emits = defineEmits<Emits>()
const service = inject<PatientService>(Provided.PatientService)!

const DEBOUNCE_MS = 300
const MIN_TERM = 2

const term = ref('')
const results = ref<PatientSearchResultModel[]>([])
const loading = ref(false)
const error = ref('')
const searched = ref(false)

let debounce: ReturnType<typeof setTimeout> | undefined
// Descarta respostas obsoletas quando o termo muda enquanto a pesquisa decorre.
let request = 0

function isHospitalized(result: PatientSearchResultModel) {
    return result.status === 'HOSPITALIZADO'
}

function onInput(value: string) {
    // Qualquer edição ao termo invalida já a selecção anterior.
    emits('clear')

    results.value = []
    error.value = ''
    searched.value = false

    if (debounce) clearTimeout(debounce)

    const trimmed = value.trim()

    if (trimmed.length < MIN_TERM) {
        loading.value = false
        request++
        emits('searching', false)
        return
    }

    loading.value = true
    emits('searching', true)

    const current = ++request
    debounce = setTimeout(() => runSearch(trimmed, current), DEBOUNCE_MS)
}

async function runSearch(trimmed: string, current: number) {
    const resOrErr = await service.searchPatients(trimmed)

    // Resposta antiga (termo mudou ou nova pesquisa já arrancou): descarta.
    if (current !== request || term.value.trim() !== trimmed) return

    loading.value = false
    searched.value = true
    emits('searching', false)

    if (resOrErr.isLeft()) {
        error.value = 'Não foi possível pesquisar. Tente novamente.'
        results.value = []
        return
    }

    results.value = resOrErr.value
}

function select(result: PatientSearchResultModel) {
    if (isHospitalized(result)) return

    emits('select', result)
}

function newPatient() {
    term.value = ''
    results.value = []
    error.value = ''
    searched.value = false
    loading.value = false
    if (debounce) clearTimeout(debounce)
    request++
    emits('clear')
    emits('searching', false)
    emits('new')
}
</script>

<template>
    <div class="space-y-3">
        <BaseInput
            placeholder="Pesquisar por ID ou nome (paciente/tutor)"
            data-field="patientSearch.term"
            v-model="term"
            @update:model-value="onInput($event)"
            @keydown.esc="newPatient()"
        />

        <p v-if="loading" class="text-sm text-gray-500">A pesquisar…</p>

        <p v-if="error" class="text-sm text-red-600" role="alert">{{ error }}</p>

        <p
            v-if="searched && !loading && !error && results.length === 0"
            class="text-sm text-gray-600"
        >
            Sem resultados para este termo.
        </p>

        <ul v-if="results.length > 0" class="space-y-2" data-search-results>
            <li v-for="result in results" :key="result.systemId">
                <button
                    type="button"
                    :disabled="isHospitalized(result)"
                    :data-search-system-id="result.systemId"
                    class="search-result flex w-full flex-wrap items-center justify-between gap-2 rounded border bg-gray-50 p-2.5 text-left hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                    @click="select(result)"
                >
                    <span class="flex flex-col text-sm text-gray-700">
                        <span><span class="text-gray-500">ID Paciente:</span> {{ result.patientId }}</span>
                        <span><span class="text-gray-500">ID Tutor:</span> {{ result.ownerId }}</span>
                        <span><span class="text-gray-500">Nome Paciente:</span> {{ result.patientName }}</span>
                        <span><span class="text-gray-500">Nome Tutor:</span> {{ result.ownerName }}</span>
                    </span>
                    <span
                        class="badge"
                        :class="isHospitalized(result) ? 'badge-gray' : 'badge-success'"
                    >
                        {{ isHospitalized(result) ? 'Já internado' : result.status }}
                    </span>
                </button>
            </li>
        </ul>

        <button type="button" class="btn btn-secondary" @click="newPatient()">
            Criar novo paciente
        </button>
    </div>
</template>
