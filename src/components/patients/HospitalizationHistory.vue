<script setup lang="ts">
import type {
    HospitalizationHistoryDetailModel,
    HospitalizationHistorySummaryModel,
    HospitalizationLinkStatusModel
} from '@/lib/models/hospitalization_history'
import { Provided } from '@/lib/provided'
import type { HospitalizationHistoryService } from '@/lib/services/hospitalization_history_service'
import { formatDate, formatTime } from '@/lib/shared/format_date'
import { parameterTitle } from '@/lib/shared/parameters'
import { computed, inject, ref, watch } from 'vue'

interface Props {
    patientId: string
    /** Só carrega quando o separador do histórico está visível. */
    active: boolean
    /**
     * Deep-link seguro: abre este episódio exacto. O backend valida que o
     * episódio pertence ao paciente (RF-15).
     */
    initialHospitalizationId?: string
}

const props = withDefaults(defineProps<Props>(), { active: false })

const service = inject<HospitalizationHistoryService>(Provided.HospitalizationHistoryService)!

const summaries = ref<HospitalizationHistorySummaryModel[]>([])
const selectedId = ref<string>()
const detail = ref<HospitalizationHistoryDetailModel>()
const linkStatus = ref<HospitalizationLinkStatusModel>()

const listLoading = ref(false)
const listError = ref('')
const detailLoading = ref(false)
const detailError = ref('')

let loadedPatientId: string | undefined
// Descarta respostas antigas quando o utilizador troca de episódio ou de paciente.
let detailRequest = 0
// Guarda da listagem (por paciente) e da navegação (watcher): impedem que uma
// execução antiga retome e misture estado de outro paciente ou episódio.
let listRequest = 0
let navigation = 0

// O backend já ordena; repetimos aqui para garantir o desempate por id mesmo
// que a origem mude.
const orderedSummaries = computed(() => sortSummaries(summaries.value))

const hasPendingLegacy = computed(() => {
    const status = linkStatus.value

    if (!status) return false

    return status.reportsWithoutHospitalization > 0 || status.roundsWithoutHospitalization > 0
})

function sortSummaries(list: HospitalizationHistorySummaryModel[]) {
    return [...list].sort((a, b) => {
        const byEntryDate = new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime()
        if (byEntryDate !== 0) return byEntryDate

        if (a.hospitalizationId === b.hospitalizationId) return 0

        return a.hospitalizationId < b.hospitalizationId ? 1 : -1
    })
}

function isOpen(status?: string) {
    return status === 'Aberta'
}

function statusLabel(status?: string) {
    if (status === 'Aberta') return 'Activa'
    if (status === 'Fechada') return 'Encerrada'

    return status ?? 'N/D'
}

async function load(patientId: string, request: number) {
    listLoading.value = true
    listError.value = ''

    const result = await service.listByPatient(patientId)

    // Resposta obsoleta (paciente mudou): não mistura summaries de A em B.
    if (request !== listRequest) return

    listLoading.value = false

    if (result.isLeft()) {
        // Não apaga o que já estava visível.
        listError.value = 'Não foi possível carregar o histórico.'
        return
    }

    summaries.value = result.value

    const status = await service.linkStatus(patientId)

    // O diagnóstico também é do paciente desta chamada, não do actual.
    if (request !== listRequest) return
    if (status.isRight()) linkStatus.value = status.value
}

async function select(patientId: string, hospitalizationId: string) {
    const request = ++detailRequest

    selectedId.value = hospitalizationId
    // Limpa já o detalhe anterior: nunca mostrar dados clínicos de H1 sob a
    // selecção/deep-link H2, nem durante o carregamento nem em falha.
    detail.value = undefined
    detailError.value = ''
    detailLoading.value = true

    const result = await service.detail(patientId, hospitalizationId)

    if (request !== detailRequest) return

    detailLoading.value = false

    if (result.isLeft()) {
        detailError.value = 'Não foi possível carregar este episódio.'
        return
    }

    detail.value = result.value
}

function resetForPatient() {
    // Invalida a listagem e o detalhe em voo do paciente anterior.
    listRequest++
    detailRequest++
    summaries.value = []
    selectedId.value = undefined
    detail.value = undefined
    listError.value = ''
    detailError.value = ''
    linkStatus.value = undefined
}

watch(
    [() => props.active, () => props.patientId, () => props.initialHospitalizationId],
    async ([active, patientId, initialId]) => {
        if (!active) return

        const run = ++navigation

        if (loadedPatientId !== patientId) {
            loadedPatientId = patientId
            resetForPatient()
            await load(patientId, listRequest)
            // A query mudou enquanto a lista carregava: nunca seleccionar o
            // initialHospitalizationId anterior.
            if (run !== navigation) return
        }

        if (initialId && initialId !== selectedId.value) {
            await select(patientId, initialId)
        }
    },
    { immediate: true }
)
</script>

<template>
    <section v-show="active" class="space-y-4">
        <h3 class="font-semibold text-gray-900">Histórico de hospitalizações</h3>

        <p v-if="listError" class="text-sm text-red-600" role="alert">{{ listError }}</p>

        <p v-if="listLoading && summaries.length === 0" class="text-sm text-gray-500">
            A carregar histórico…
        </p>

        <p
            v-if="!listLoading && !listError && summaries.length === 0"
            class="text-sm text-gray-600"
        >
            Sem histórico de hospitalizações
        </p>

        <ul v-if="orderedSummaries.length > 0" class="space-y-2">
            <li v-for="item in orderedSummaries" :key="item.hospitalizationId">
                <button
                    type="button"
                    :data-hospitalization-id="item.hospitalizationId"
                    :aria-current="item.hospitalizationId === selectedId ? 'true' : undefined"
                    class="history-item flex w-full flex-wrap items-center justify-between gap-2 rounded border bg-gray-50 p-2.5 text-left hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    :class="{ 'border-blue-400': item.hospitalizationId === selectedId }"
                    @click="select(patientId, item.hospitalizationId)"
                >
                    <span class="text-sm text-gray-700">
                        {{ formatDate(item.entryDate) }}
                        <span v-if="item.dischargeDate" class="text-gray-500">
                            → {{ formatDate(item.dischargeDate) }}
                        </span>
                    </span>
                    <span
                        class="badge"
                        :class="isOpen(item.status) ? 'badge-success' : 'badge-gray'"
                    >
                        {{ statusLabel(item.status) }}
                    </span>
                </button>
            </li>
        </ul>

        <p v-if="hasPendingLegacy" class="text-xs text-gray-500">
            Existem registos históricos por classificar que podem não aparecer em nenhum episódio.
        </p>

        <div v-if="selectedId" class="space-y-3">
            <p v-if="detailError" class="text-sm text-red-600" role="alert">{{ detailError }}</p>
            <p v-if="detailLoading" class="text-sm text-gray-500">A carregar episódio…</p>

            <div v-if="detail" class="space-y-4">
                <section>
                    <h4 class="font-medium text-gray-900">Hospitalização</h4>
                    <ul class="patient-info mt-2">
                        <li class="patient-info-item">
                            <span>Entrada</span>
                            <span class="patient-info-text">
                                {{ formatDate(detail.hospitalization.entryDate) }}
                            </span>
                        </li>
                        <li class="patient-info-item">
                            <span>Alta</span>
                            <span class="patient-info-text">
                                {{ formatDate(detail.hospitalization.dischargeDate) }}
                            </span>
                        </li>
                        <li class="patient-info-item">
                            <span>Estado</span>
                            <span
                                class="badge"
                                :class="isOpen(detail.hospitalization.status) ? 'badge-success' : 'badge-gray'"
                            >
                                {{ statusLabel(detail.hospitalization.status) }}
                            </span>
                        </li>
                        <li class="patient-info-item">
                            <span>Peso (Kg)</span>
                            <span class="patient-info-text">{{ detail.hospitalization.weight }}</span>
                        </li>
                        <li class="patient-info-item flex-col">
                            <span>Queixas</span>
                            <div class="mt-1 space-x-2 space-y-2">
                                <span
                                    v-for="complaint in detail.hospitalization.complaints"
                                    :key="complaint"
                                    class="badge badge-dark"
                                >
                                    {{ complaint }}
                                </span>
                            </div>
                        </li>
                        <li class="patient-info-item flex-col">
                            <span>Diagnosticos</span>
                            <div class="mt-1 space-x-2 space-y-2">
                                <span
                                    v-for="diagnostic in detail.hospitalization.diagnostics"
                                    :key="diagnostic"
                                    class="badge badge-dark"
                                >
                                    {{ diagnostic }}
                                </span>
                            </div>
                        </li>
                    </ul>
                </section>

                <section>
                    <h4 class="font-medium text-gray-900">Orçamento</h4>
                    <ul v-if="detail.budget" class="patient-info mt-2">
                        <li class="patient-info-item">
                            <span>Iniciou em</span>
                            <span class="patient-info-text">{{ formatDate(detail.budget.startOn) }}</span>
                        </li>
                        <li class="patient-info-item">
                            <span>Termina em</span>
                            <span class="patient-info-text">{{ formatDate(detail.budget.endOn) }}</span>
                        </li>
                        <li class="patient-info-item">
                            <span>Estado</span>
                            <span class="patient-info-text">{{ detail.budget.status }}</span>
                        </li>
                    </ul>
                    <p v-else class="mt-2 text-sm text-gray-600">Sem orçamento registado</p>
                </section>

                <section>
                    <h4 class="font-medium text-gray-900">Rondas / Exames</h4>
                    <ul v-if="detail.rounds.length > 0" class="mt-2 space-y-3">
                        <li
                            v-for="round in detail.rounds"
                            :key="round.roundId"
                            class="rounded border p-2.5"
                        >
                            <p class="text-sm text-gray-500">
                                {{ formatDate(round.issuedAt) }} {{ formatTime(round.issuedAt) }}
                            </p>
                            <ul class="mt-1 space-y-1">
                                <li
                                    v-for="measurement in round.measurements"
                                    :key="measurement.name + measurement.issuedAt"
                                    class="flex justify-between text-sm text-gray-700"
                                >
                                    <span>{{ parameterTitle(measurement.name) || measurement.name }}</span>
                                    <span>{{ measurement.value }}</span>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <p v-else class="mt-2 text-sm text-gray-600">Sem rondas registadas</p>
                </section>

                <section>
                    <h4 class="font-medium text-gray-900">Relatórios / Comunicações</h4>
                    <ul v-if="detail.reports.length > 0" class="mt-2 space-y-3">
                        <li
                            v-for="report in detail.reports"
                            :key="report.reportId"
                            class="rounded border p-2.5"
                        >
                            <p class="text-sm text-gray-500">
                                {{ formatDate(report.createdAt) }} {{ formatTime(report.createdAt) }}
                            </p>
                            <p class="text-sm text-gray-700">
                                Estado de consciência: {{ report.stateOfConsciousness.join(', ') }}
                            </p>
                            <p class="text-sm text-gray-700">
                                Alimentação: {{ report.food.types.join(', ') }} ({{ report.food.level }})
                            </p>
                            <p v-if="report.comments" class="text-sm text-gray-700">
                                {{ report.comments }}
                            </p>
                            <div v-if="report.discharges.length > 0" class="mt-1">
                                <p class="text-sm text-gray-500">Descargas</p>
                                <ul class="space-y-1">
                                    <li
                                        v-for="discharge in report.discharges"
                                        :key="discharge.type + discharge.aspects.join(',')"
                                        class="text-sm text-gray-700"
                                    >
                                        <span class="font-medium">{{ discharge.type }}</span>:
                                        {{ discharge.aspects.join(', ') }}
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                    <p v-else class="mt-2 text-sm text-gray-600">Sem relatórios registados</p>
                </section>

                <section>
                    <h4 class="font-medium text-gray-900">Contacto usado</h4>
                    <div v-if="detail.contact" class="mt-2 flex flex-wrap items-center gap-2">
                        <span class="patient-info-text">{{ detail.contact.name }}</span>
                        <span class="badge badge-dark">
                            {{
                                detail.contactIsSpecific
                                    ? 'Contacto específico desta hospitalização'
                                    : 'Tutor principal'
                            }}
                        </span>
                        <span class="patient-info-text">{{ detail.contact.phoneNumber }}</span>
                        <span class="patient-info-text">
                            {{ detail.contact.whatsapp ? 'Tem WhatsApp' : 'Não tem WhatsApp' }}
                        </span>
                    </div>
                    <p v-else class="mt-2 text-sm text-gray-600">Sem contacto registado</p>
                </section>
            </div>
        </div>
    </section>
</template>
