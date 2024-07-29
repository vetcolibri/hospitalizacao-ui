<script setup lang="ts">
import { findLevelDescription, findLevelTitle } from '@/lib/data/food'
import { type OwnerReportModel } from '@/lib/models/owner'
import { Provided } from '@/lib/provided'
import { type CrmService } from '@/lib/services/crm_service'
import { formatDate, formatTime } from '@/lib/shared/format_date'
import { inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const report = ref<OwnerReportModel>()
const viewPatientResume = ref<boolean>(true)
const route = useRoute()
const hasRouteQuery = route.query && Object.keys(route.query).length > 0
const service = inject<CrmService>(Provided.CrmService)!

function verifyQuery() {
    if (hasRouteQuery) return
    viewPatientResume.value = false
}

async function lastReport() {
    const dataOrErr = await service.lastReport(
        route.query.patientId as string,
        route.query.ownerId as string,
        route.query.hospitalizationId as string
    )

    if (dataOrErr.isLeft()) {
        return
    }

    return dataOrErr.value
}

onMounted(async () => {
    verifyQuery()
    report.value = await lastReport()
})
</script>

<template>
    <section class="bg-gray-200 p-4 sm:h-screen">
        <div class="flex flex-col justify-center h-full mx-auto max-w-sm sm:max-w-xl">
            <div v-if="viewPatientResume" class="bg-white p-4 rounded sm:p-8">
                <div class="flex items-center justify-between">
                    <h1 class="text-2xl text-center font-medium mb-4">Resumo</h1>
                    <span class="text-xs text-gray-500">
                        {{ formatDate(report?.createdAt) }} às {{ formatTime(report?.createdAt) }}
                    </span>
                </div>
                <div class="space-y-3">
                    <ul class="patient-info">
                        <li class="patient-info-item">
                            <span>ID Paciente</span>
                            <span>{{ report?.patientId }}</span>
                        </li>
                        <li class="patient-info-item">
                            <span>Paciente</span>
                            <span>{{ report?.patientName }}</span>
                        </li>
                    </ul>

                    <ul class="patient-info">
                        <li class="patient-info-item flex-col space-y-2">
                            <span>Estado de Consciência</span>
                            <div class="flex flex-wrap">
                                <span
                                    v-for="opt in report?.stateOfConsciousness"
                                    class="badge badge-dark mr-2 mb-2 sm:mb-0"
                                >
                                    {{ opt }}
                                </span>
                            </div>
                        </li>
                    </ul>

                    <div class="flex justify-between items-center text-gray-500 border-t p-1">
                        <h2>Alimentação</h2>
                        <div class="flex items-center text-xs space-x-1">
                            <i class="bi bi-clock"></i>
                            <span>
                                {{ formatDate(report?.food.datetime) }} às
                                {{ formatTime(report?.food.datetime) }}
                            </span>
                        </div>
                    </div>

                    <ul class="patient-info">
                        <li class="patient-info-item flex-col space-y-2">
                            <span>Tipo</span>
                            <div class="flex flex-wrap">
                                <span
                                    v-for="opt in report?.food.types"
                                    class="badge badge-dark mr-2"
                                >
                                    {{ opt }}
                                </span>
                            </div>
                        </li>
                    </ul>

                    <ul class="patient-info">
                        <li class="patient-info-item">
                            <span>Nível</span>
                            <span>{{ findLevelTitle(report?.food.level) }}</span>
                        </li>
                        <li class="text-sm text-justify">
                            {{ findLevelDescription(report?.food.level) }}
                        </li>
                    </ul>

                    <div class="text-gray-500 border-t p-1">
                        <h2>Descargas</h2>
                    </div>

                    <ul class="patient-info">
                        <li class="patient-info-item">
                            <span>Tipo</span>
                            <span>{{ report?.discharge.type }}</span>
                        </li>
                        <li class="patient-info-item">
                            <span>Aspecto</span>
                            <span>{{ report?.discharge.aspect }}</span>
                        </li>
                    </ul>

                    <div class="text-gray-500 border-t p-1">
                        <h2>Orçamento</h2>
                    </div>

                    <ul class="patient-info">
                        <li class="patient-info-item">
                            <span>Estado</span>
                            <span>{{ report?.budgetStatus }}</span>
                        </li>
                    </ul>

                    <div class="text-gray-500 border-t p-1">
                        <h2>Observações</h2>
                    </div>

                    <p class="text-gray-500 text-justify text-sm patient-info-item h-32">
                        {{ report?.comments }}
                    </p>
                </div>
            </div>
            <div v-else class="bg-white p-4 rounded sm:p-8 shadow-sm text-gray-500">
                <div class="flex items-center space-x-2">
                    <i class="bi bi-exclamation-circle-fill text-2xl"></i>
                    <p>O seu link é inválido. Por favor solicite novamento o link.</p>
                </div>
            </div>
        </div>
    </section>
</template>
