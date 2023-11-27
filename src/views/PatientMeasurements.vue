<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import Pagination from '@/components/Pagination.vue'

import { computed, inject, onMounted, ref } from 'vue'

import {
    makeHourFormat,
    makeDateFormat,
    findParameterName,
    findParameterUnity
} from '@/lib/shared/utils'
import type { Measurement } from '@/models/measurement'
import type { IRoundService } from '@/services/round_service'
import { Provided } from '@/lib/provided'
import { usePatientSelectedStore } from '@/store/patientStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const measurements = ref<Measurement[]>([])
const patientStore = usePatientSelectedStore()
const patientId = patientStore.patient
const roundService = inject<IRoundService>(Provided.ROUND_SERVICE)!

const currentPage = ref<number>(1)
const perPage = 20

const pages = computed(() => {
    return Math.ceil(measurements.value.length / perPage)
})

const results = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return measurements.value.slice(start, start + perPage)
})

function updatePage(page: number) {
    currentPage.value = page
}

onMounted(async () => {
    if (!patientId) return router.back()

    const measurementsOrError = await roundService.getAllMeasurements(patientId)
    if (measurementsOrError.isLeft()) return
    measurements.value = measurementsOrError.value
})
</script>
<template>
    <div>
        <Header title="Medições">
            <GoBack />
        </Header>
        <main class="main-content">
            <section class="container rounded mt-8 mb-4">
                <ul class="flex space-x-3 text-sm">
                    <li>
                        <router-link
                            :to="{ name: 'DailyRound' }"
                            class="flex items-center p-2.5 border rounded bg-gray-100 space-x-1"
                        >
                            <i class="bi bi-clipboard2-data-fill icon"></i>
                            <span>Ronda diária</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link
                            class="flex items-center p-2.5 border rounded bg-gray-100 space-x-1"
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
                    <table class="w-full text-sm text-left">
                        <thead class="text-gray-700 uppercase">
                            <tr>
                                <th scope="col" class="px-3 py-1 sm:px-6 sm:py-3">Parâmetro</th>
                                <th scope="col" class="px-3 py-1 sm:px-6 sm:py-3">
                                    Medição (Unit.)
                                </th>
                                <th scope="col" class="px-3 py-1 sm:px-6 sm:py-3">Data</th>
                                <th scope="col" class="px-3 py-1 sm:px-6 sm:py-3">Hora</th>
                            </tr>
                        </thead>
                        <tbody v-if="measurements.length > 0">
                            <tr v-for="parameter of results" class="border-t border-gray-200">
                                <th
                                    scope="row"
                                    class="px-3 py-1 sm:px-6 sm:py-4 font-medium text-gray-90"
                                >
                                    {{ findParameterName(parameter.name) }}
                                </th>
                                <td class="px-3 py-1 sm:px-6 sm:py-3">
                                    {{ parameter.value }}
                                    {{ findParameterUnity(parameter.name) }}
                                </td>
                                <td class="px-3 py-1 sm:px-6 sm:py-3">
                                    {{ makeDateFormat(new Date(parameter.issuedAt!)) }}
                                </td>
                                <td class="px-3 py-1 sm:px-6 sm:py-3">
                                    {{ makeHourFormat(new Date(parameter.issuedAt!)) }}
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
