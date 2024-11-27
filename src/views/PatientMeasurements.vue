<script setup lang="ts">
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import Header from '@/components/Header.vue'
import Pagination from '@/components/Pagination.vue'
import ParameterStatus from '@/components/parameters/ParameterStatus.vue'
import PatientCondition from '@/components/patients/PatientCondition.vue'

import { Round } from '@/lib/domain/round'
import type { MeasurementModel } from '@/lib/models/measurement'
import { Provided } from '@/lib/provided'
import type { RoundService } from '@/lib/services/round_service'
import { formatDate, formatTime } from '@/lib/shared/format_date'
import { useCurrentPatient } from '@/lib/store/patientStore'
import { computed, inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const patientConditionRef = ref<typeof PatientCondition>()
const measurements = ref<MeasurementModel[]>([])
const patientStore = useCurrentPatient()
const { patientId } = patientStore.patient
const service = inject<RoundService>(Provided.RoundService)!
const round = ref()

const currentPage = ref<number>(1)
const perPage = 20

const pages = computed(() => {
    return Math.ceil(measurements.value.length / perPage)
})

const results = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return round.value.parameters?.slice(start, start + perPage)
})

function updatePage(page: number) {
    currentPage.value = page
}

function openReportDialog() {
    patientConditionRef.value?.open()
}

onMounted(async () => {
    if (!patientId) return router.back()
    measurements.value = await service.getAllMeasurement(patientId)
    round.value = Round.build(measurements.value)
})
</script>
<template>
    <div>
        <Header title="Medições">
            <GoBack />
        </Header>
        <main class="main-content">
            <section class="mx-auto my-4 lg:max-w-3xl">
                <ul class="flex flex-col space-y-2 text-sm md:space-y-0 md:flex-row md:space-x-3">
                    <li>
                        <router-link
                            :to="{ name: 'DailyRound' }"
                            class="flex items-center p-3 border rounded bg-white space-x-1"
                        >
                            <i class="bi bi-clipboard2-data-fill mr-2 icon"></i>
                            <span>Ronda diária</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link
                            class="flex items-center p-3 border rounded bg-white space-x-1"
                            :to="{ name: 'ChooseParameters' }"
                        >
                            <i class="bi bi-clipboard2-data-fill mr-2 icon"></i>
                            <span>Monitorização continuada</span>
                        </router-link>
                    </li>
                    <li>
                        <button
                            class="flex items-center p-3 border rounded bg-white space-x-1 w-full"
                            @click="openReportDialog()"
                        >
                            <i class="bi bi-person-fill mr-2 icon"></i>
                            <span>Comunicar ao Tutor</span>
                        </button>
                    </li>
                </ul>
            </section>

            <section class="container flex flex-col justify-between mb-8">
                <div class="relative overflow-x-auto">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead class="text-gray-700 uppercase text-xs bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3">Parâmetro</th>
                                <th scope="col" class="px-6 py-3">Medição</th>
                                <th scope="col" class="px-6 py-3">Data</th>
                                <th scope="col" class="px-6 py-3">Hora</th>
                                <th scope="col" class="px-6 py-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody v-if="measurements.length > 0">
                            <tr
                                v-for="parameter of results"
                                :key="parameter.title"
                                class="border-t border-gray-200"
                            >
                                <td class="px-6 py-4">
                                    {{ parameter.title }}
                                </td>
                                <td class="px-6 py-4">
                                    {{ parameter.value }}
                                    {{ parameter.unit }}
                                </td>
                                <td class="px-6 py-4">
                                    {{ formatDate(parameter?.issuedAt) }}
                                </td>

                                <td class="px-6 py-4">
                                    {{ formatTime(parameter?.issuedAt) }}
                                </td>

                                <td>
                                    <ParameterStatus
                                        :value="parameter.value"
                                        :status="parameter.verifyStatus()"
                                        :colors="parameter?.colors"
                                        :options="parameter?.options"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div
                    v-if="measurements.length === 0"
                    class="h-full text-center text-sm text-gray-600"
                >
                    Nenhuma medição encontrada
                </div>
                <Pagination
                    v-if="pages > 1"
                    :current-page="currentPage"
                    :pages="pages"
                    @update-page="(page) => updatePage(page)"
                />
            </section>
        </main>

        <PatientCondition
            ref="patientConditionRef"
            :patientId="patientStore.patient.patientId"
            :ownerId="patientStore.patient.ownerId"
            :hospitalizationId="patientStore.patient.hospitalizationId"
        />
        <Footer></Footer>
    </div>
</template>
