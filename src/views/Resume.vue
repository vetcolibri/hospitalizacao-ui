<script setup lang="ts">
import { findLevelDescription } from '@/lib/data/food'
import { formatDate, formatTime } from '@/lib/shared/format_date'
import { type OwnerReportModel } from '@/lib/models/owner'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const viewPatientResume = ref<boolean>(true)
const report = ref<OwnerReportModel>()

const route = useRoute()
const hasRouteQuery = route.query && Object.keys(route.query).length > 0

function verifyQuery() {
    if (hasRouteQuery) return
    viewPatientResume.value = false
}

function getReport(): OwnerReportModel {
    return {
        ownerName: 'Maria da Silva',
        patientName: 'João da Silva',
        stateOfConsciousness: ['Consciente'],
        food: {
            types: ['Sólida'],
            level: '1',
            datetime: '2022-01-01T12:00:00'
        },
        discharges: {
            type: 'Urina',
            aspect: 'Clara'
        },
        budgetStatus: 'Aguardando aprovação',
        comments: 'Paciente está bem'
    }
}

onMounted(() => {
    verifyQuery()
    report.value = getReport()
})
</script>

<template>
    <section class="bg-gray-200 p-4 sm:h-screen">
        <div class="flex flex-col justify-center h-full mx-auto max-w-sm sm:max-w-xl">
            <div v-if="viewPatientResume" class="bg-white p-4 rounded sm:p-8">
                <h1 class="text-2xl text-center font-medium mb-4">Resumo</h1>
                <div class="space-y-3">
                    <ul class="patient-info">
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
                            <span>{{ report?.food.level }}</span>
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
                            <span>{{ report?.discharges.type }}</span>
                        </li>
                        <li class="patient-info-item">
                            <span>Aspecto</span>
                            <span>{{ report?.discharges.aspect }}</span>
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

                    <p class="text-gray-500 text-justify text-sm patient-info-item">
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
