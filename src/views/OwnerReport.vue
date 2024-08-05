<script setup lang="ts">
import { findLevelDescription, findLevelTitle } from '@/lib/data/food'
import { type OwnerReportModel } from '@/lib/models/owner'
import { Provided } from '@/lib/provided'
import { type CrmService } from '@/lib/services/crm_service'
import { formatDate, formatTime } from '@/lib/shared/format_date'
import { inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const reports = ref<OwnerReportModel[]>()
const viewPatientResume = ref<boolean>(true)
const route = useRoute()
const hasRouteQuery = route.query && Object.keys(route.query).length > 0
const service = inject<CrmService>(Provided.CrmService)!
const currentReport = ref<OwnerReportModel>()

function verifyQuery() {
    if (hasRouteQuery) return
    viewPatientResume.value = false
}

function changeReport(reportId: string) {
    const report = reports.value?.find((r) => r.reportId === reportId)

    if (!report) return

    currentReport.value = report
}

async function getReports() {
    const dataOrErr = await service.getReports(
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

    reports.value = await getReports()
    currentReport.value = reports.value?.[0]
})
</script>

<template>
    <section class="bg-gray-200 lg:h-screen">
        <div
            v-if="currentReport"
            class="flex flex-col justify-center p-4 items-center gap-2 sm:flex-row lg:gap-6"
        >
            <div class="w-full md:w-[60%] lg:w-1/2 xl:w-1/3 rounded bg-white p-3">
                <div
                    class="flex flex-col justify-center items-center sm:flex-row sm:justify-start gap-1 text-gray-500"
                >
                    <img src="/img/cvl-192x192.png" width="50" alt="centro-veterinário-de-luanda" />
                    <p class="text-sm">Centro Veterinário de Luanda</p>
                </div>
                <div class="space-y-2 flex flex-col sm:flex-row items-center justify-between mt-4">
                    <h2 class="text-2xl">
                        {{ currentReport?.patientName }}, {{ currentReport?.patientId }}
                    </h2>
                    <div class="flex items-center space-x-1 text-xs text-gray-500">
                        <i class="bi bi-clock"></i>
                        <span>
                            Ultima actualização,
                            {{ formatDate(currentReport?.createdAt) }} às
                            {{ formatTime(currentReport?.createdAt) }}
                        </span>
                    </div>
                </div>

                <ul class="patient-info mt-6">
                    <li class="patient-info-item flex-col space-y-2">
                        <span>Estado de Consciência</span>
                        <div class="flex flex-wrap">
                            <span
                                v-for="opt in currentReport?.stateOfConsciousness"
                                class="badge badge-dark mr-2 mb-2 sm:mb-0"
                            >
                                {{ opt }}
                            </span>
                        </div>
                    </li>
                </ul>

                <div class="mt-6 text-gray-500 border-t space-y-4">
                    <div class="flex items-center justify-between">
                        <h2>Alimentação</h2>
                        <div class="text-xs space-x-1">
                            <i class="bi bi-clock"></i>
                            <span>
                                {{ formatDate(currentReport?.food.datetime) }} às
                                {{ formatTime(currentReport?.food.datetime) }}
                            </span>
                        </div>
                    </div>

                    <ul class="patient-info">
                        <li class="patient-info-item flex-col space-y-2">
                            <span>Tipo</span>
                            <div class="flex flex-wrap">
                                <span
                                    v-for="opt in currentReport?.food.types"
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
                            <span>{{ findLevelTitle(currentReport?.food.level) }}</span>
                        </li>
                    </ul>
                    <p class="text-sm text-justify">
                        OBS.: {{ findLevelDescription(currentReport?.food.level) }}
                    </p>
                </div>

                <div class="mt-6 border-t text-gray-500 space-y-4">
                    <h2>Descargas</h2>
                    <ul class="patient-info" v-for="discharge of currentReport?.discharges">
                        <li class="patient-info-item">
                            <span>Tipo</span>
                            <span>{{ discharge.type }}</span>
                        </li>
                        <li class="patient-info-item">
                            <span>Aspectos</span>
                            <div class="flex flex-wrap">
                                <span
                                    v-for="opt in discharge.aspects"
                                    class="badge badge-dark mr-2"
                                >
                                    {{ opt }}
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="border-t mt-6 text-gray-500 space-y-4">
                    <h2>Orçamento</h2>
                    <ul class="patient-info">
                        <li class="patient-info-item">
                            <span>Estado</span>
                            <span>{{ currentReport?.budgetStatus }}</span>
                        </li>
                    </ul>
                </div>

                <div class="border-t space-y-4 text-gray-500 mt-6">
                    <h2>Observações</h2>
                    <p class="text-gray-500 text-justify text-sm patient-info-item h-24">
                        {{ currentReport?.comments }}
                    </p>
                </div>
            </div>
            <div
                class="w-full md:w-[40%] lg:w-1/3 xl:w-1/6 rounded place-self-start bg-white p-8 space-y-3 h-64 overflow-y-auto"
            >
                <h4 class="text-lg font-medium">Histórico</h4>
                <ul class="text-sm space-y-3 list-inside list-disc">
                    <li
                        class="cursor-pointer underline text-gray-600 hover:text-blue-500"
                        v-for="report in reports"
                        @click="changeReport(report.reportId)"
                    >
                        {{ report.patientName }}, {{ report.patientId }} -
                        {{ formatDate(report.createdAt) }} às {{ formatTime(report.createdAt) }}
                    </li>
                </ul>
            </div>
        </div>
        <div v-else class="sm:h-screen flex flex-col justify-center">
            <div
                class="w-full sm:max-w-2xl mx-auto rounded shadow-sm space-x-2 bg-white p-3 sm:p-6 border"
            >
                <div class="flex items-center gap-1 text-gray-500">
                    <img src="/img/cvl-192x192.png" width="50" alt="centro-veterinário-de-luanda" />
                    <p class="text-sm">Centro Veterinário de Luanda</p>
                </div>

                <p class="text-gray-600 mt-6 text-justify">
                    O seu paciente não possui nenhum relatório de acompanhamento, aguarde pela
                    actualização ou consulte o médico responsável.
                </p>
            </div>
        </div>
    </section>
</template>
