<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import Pagination from '@/components/Pagination.vue'
import ParameterStatus from '@/components/parameters/ParameterStatus.vue'

import { computed, inject, onMounted, ref } from 'vue'

import type { MeasurementModel } from '@/lib/models/measurement'
import type { RoundService } from '@/lib/services/round_service'
import { Provided } from '@/lib/provided'
import { useCurrentPatient } from '@/lib/store/patientStore'
import { useRouter } from 'vue-router'
import { formatDate } from '@/lib/shared/format_date'
import { Round } from '@/lib/domain/round'

const router = useRouter()
const measurements = ref<MeasurementModel[]>([])
const patientStore = useCurrentPatient()
const patientId = patientStore.patient
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
            <section class="my-4 lg:max-w-3xl lg:mx-auto">
                <ul class="flex md:flex-row space-x-3 text-sm">
                    <li>
                        <router-link
                            :to="{ name: 'DailyRound' }"
                            class="flex items-center p-3 border rounded bg-white space-x-1"
                        >
                            <i class="bi bi-clipboard2-data-fill icon"></i>
                            <span>Ronda diária</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link
                            class="flex items-center p-3 border rounded bg-white space-x-1"
                            :to="{ name: 'ChooseParameters' }"
                        >
                            <i class="bi bi-clipboard2-data-fill icon"></i>
                            <span>Monitorização continuada</span>
                        </router-link>
                    </li>
                </ul>
            </section>
            <section class="container flex flex-col justify-between mb-8">
                <div class="relative overflow-auto">
                    <table class="w-full text-sm text-center">
                        <thead class="text-gray-700 uppercase">
                            <tr>
                                <th class="px-3 py-1 text-left sm:px-6 sm:py-3">Parâmetro</th>
                                <th class="px-3 py-1 sm:px-6 sm:py-3">Medição (Unid.)</th>
                                <th class="px-3 py-1 sm:px-6 sm:py-3">Data de medição</th>
                                <th class="px-3 py-1 sm:px-6 sm:py-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody v-if="measurements.length > 0">
                            <tr v-for="parameter of results" class="border-t border-gray-200">
                                <td
                                    class="px-3 py-1 font-medium text-gray-900 text-left sm:px-6 sm:py-4"
                                >
                                    {{ parameter.title }}
                                </td>
                                <td class="px-3 py-1 sm:px-6 sm:py-3">
                                    {{ parameter.value }}
                                    {{ parameter.unit }}
                                </td>
                                <td class="px-3 py-1 sm:px-6 sm:py-3">
                                    {{ formatDate(parameter?.issuedAt) }}
                                </td>

                                <td>
                                    <ParameterStatus
                                        :value="parameter.value"
                                        :status="parameter.verifyStatus()"
                                        :colors="parameter?.colors"
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
        <Footer></Footer>
    </div>
</template>
