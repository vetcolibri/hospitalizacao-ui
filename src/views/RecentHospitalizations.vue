<script setup lang="ts">
import BaseInput from '@/components/BaseInput.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import Header from '@/components/Header.vue'
import HospitalizationHistory from '@/components/patients/HospitalizationHistory.vue'
import type { RecentHospitalizationModel } from '@/lib/models/recent_hospitalization'
import { Provided } from '@/lib/provided'
import type { HospitalizationService } from '@/lib/services/hospitalization_service'
import { formatDate } from '@/lib/shared/format_date'
import { computed, inject, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * Fase 2 — últimos 20 internamentos (read-only).
 *
 * Filtro unificado (mesmo termo dos quatro campos) com debounce, intervalo
 * De/Até inclusivo por data de entrada e respostas obsoletas descartadas.
 * Escolher uma linha abre o episódio exacto via deep-link (`patientId` +
 * `hospitalizationId`), reutilizando o histórico existente (RF-15), que valida
 * no backend que o episódio pertence ao paciente.
 */

const DEBOUNCE_MS = 300

const service = inject<HospitalizationService>(Provided.HospitalizationService)!
const router = useRouter()
const route = useRoute()

const term = ref('')
const from = ref('')
const to = ref('')

const items = ref<RecentHospitalizationModel[]>([])
const loading = ref(false)
const error = ref('')
const searched = ref(false)

let debounce: ReturnType<typeof setTimeout> | undefined
let request = 0

// Deep-link: o episódio seleccionado vive na query, por isso refresh e
// back/forward preservam-no.
const selectedPatientId = computed(() => (route.query.patientId as string) || undefined)
const selectedHospitalizationId = computed(
    () => (route.query.hospitalizationId as string) || undefined
)

function invalidateSelection() {
    if (!selectedPatientId.value && !selectedHospitalizationId.value) return

    void router.replace({ name: 'RecentHospitalizations', query: {} })
}

function scheduleSearch(delay: number, invalidate: boolean) {
    // Alterar qualquer filtro invalida imediatamente resultados/respostas anteriores.
    if (invalidate) invalidateSelection()

    if (debounce) clearTimeout(debounce)

    loading.value = true
    const current = ++request
    debounce = setTimeout(() => runSearch(current), delay)
}

async function runSearch(current: number) {
    const result = await service.recent({
        term: term.value.trim() || undefined,
        from: from.value || undefined,
        to: to.value || undefined
    })

    if (current !== request) return

    loading.value = false
    searched.value = true

    if (result.isLeft()) {
        error.value = 'Não foi possível carregar os internamentos.'
        items.value = []
        return
    }

    error.value = ''
    items.value = result.value
}

function onTerm(value: string) {
    term.value = value
    scheduleSearch(DEBOUNCE_MS, true)
}

function onDate() {
    scheduleSearch(0, true)
}

function clearFilters() {
    term.value = ''
    from.value = ''
    to.value = ''
    scheduleSearch(0, true)
}

function openEpisode(row: RecentHospitalizationModel) {
    void router.push({
        name: 'RecentHospitalizations',
        query: { patientId: row.systemId, hospitalizationId: row.hospitalizationId }
    })
}

onMounted(() => scheduleSearch(0, false))

onUnmounted(() => {
    if (debounce) clearTimeout(debounce)
    request++
})
</script>

<template>
    <Header title="Últimos internamentos">
        <GoBack />
    </Header>

    <main class="main-content text-gray-500">
        <section class="container my-4 space-y-3">
            <h1 class="font-medium text-gray-900">Últimos internamentos</h1>
            <p class="text-sm text-gray-500">
                Os 20 internamentos mais recentes. Filtre por paciente/tutor e por intervalo de
                entrada.
            </p>

            <BaseInput
                placeholder="Pesquisar internamentos (ID ou nome)"
                data-field="recent.term"
                v-model="term"
                @update:model-value="onTerm($event)"
            />

            <div class="form-container items-end">
                <label class="flex-1 text-sm">
                    <span class="block text-gray-500">De</span>
                    <input
                        type="date"
                        class="form-control"
                        data-field="recent.from"
                        v-model="from"
                        @change="onDate()"
                    />
                </label>
                <label class="flex-1 text-sm">
                    <span class="block text-gray-500">Até</span>
                    <input
                        type="date"
                        class="form-control"
                        data-field="recent.to"
                        v-model="to"
                        @change="onDate()"
                    />
                </label>
                <button type="button" class="btn btn-secondary" @click="clearFilters()">
                    Limpar filtros
                </button>
            </div>

            <p v-if="loading" class="text-sm text-gray-500">A carregar…</p>
            <p v-if="error" class="text-sm text-red-600" role="alert">{{ error }}</p>

            <p
                v-if="searched && !loading && !error && items.length === 0"
                class="text-sm text-gray-600"
            >
                Sem internamentos para os filtros.
            </p>

            <ul v-if="items.length > 0" class="space-y-2" data-recent-results>
                <li v-for="item in items" :key="item.hospitalizationId">
                    <button
                        type="button"
                        :data-recent-hospitalization-id="item.hospitalizationId"
                        class="recent-item flex w-full flex-wrap items-center justify-between gap-2 rounded border bg-gray-50 p-2.5 text-left hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        @click="openEpisode(item)"
                    >
                        <span class="flex flex-col text-sm text-gray-700">
                            <span>
                                <span class="text-gray-500">Entrada:</span>
                                {{ formatDate(item.entryDate) }}
                                <span v-if="item.dischargeDate" class="text-gray-500">
                                    → {{ formatDate(item.dischargeDate) }}
                                </span>
                            </span>
                            <span><span class="text-gray-500">ID Paciente:</span> {{ item.patientId }}</span>
                            <span><span class="text-gray-500">ID Tutor:</span> {{ item.ownerId }}</span>
                            <span><span class="text-gray-500">Nome Paciente:</span> {{ item.patientName }}</span>
                            <span><span class="text-gray-500">Nome Tutor:</span> {{ item.ownerName }}</span>
                        </span>
                        <span
                            class="badge"
                            :class="item.status === 'Aberta' ? 'badge-success' : 'badge-gray'"
                        >
                            {{ item.status === 'Aberta' ? 'Activa' : 'Encerrada' }}
                        </span>
                    </button>
                </li>
            </ul>
        </section>

        <section
            v-if="selectedPatientId && selectedHospitalizationId"
            class="container my-4 space-y-3"
        >
            <h2 class="font-medium text-gray-900">Episódio</h2>
            <HospitalizationHistory
                :patient-id="selectedPatientId"
                :initial-hospitalization-id="selectedHospitalizationId"
                :active="true"
            />
        </section>
    </main>

    <Footer />
</template>
