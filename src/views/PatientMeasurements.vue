<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import { RouterLink } from 'vue-router'
import { inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import {
    makeHourFormat,
    makeDateFormat,
    findParameterName,
    findParameterUnity
} from '@/lib/shared/utils'
import { Measurement } from '@/models/measurement'
import { MeasurementService } from '@/services/measurement_service'
import { Provided } from '@/lib/provided'

const parameters = ref<Measurement[]>([])
const route = useRoute()
const patientId = `${route.params.patientId}`
const measurmentService = inject<MeasurementService>(Provided.MEASUREMENT_SERVICE)!

onMounted(async () => {
    const data = await await measurmentService.getAllMeasurements(patientId)
    parameters.value = data
})
</script>
<template>
    <div>
        <Header title="Medições">
            <GoBack />
        </Header>
        <main class="main-content py-8">
            <section class="container">
                <ul class="flex space-x-2">
                    <li>
                        <router-link
                            :to="{
                                name: 'DailyRound',
                                params: { patientId: $route.params.patientId }
                            }"
                        >
                            <button class="p-2 border rounded bg-gray-100">Ronda Diária</button>
                        </router-link>
                    </li>
                    <li>
                        <router-link
                            :to="{
                                name: 'ChooseParameters',
                                params: { patientId: $route.params.patientId }
                            }"
                        >
                            <button class="p-2 border rounded bg-gray-100">
                                Monitorização continuada
                            </button>
                        </router-link>
                    </li>
                </ul>
                <div class="relative overflow-x-auto">
                    <table class="w-full text-sm text-left">
                        <thead class="text-xs text-gray-700 uppercase">
                            <tr>
                                <th scope="col" class="px-6 py-3">Parâmetro</th>
                                <th scope="col" class="px-6 py-3">Medição (Unit.)</th>
                                <th scope="col" class="px-6 py-3">Data</th>
                                <th scope="col" class="px-6 py-3">Hora</th>
                            </tr>
                        </thead>
                        <tbody v-if="parameters.length > 0">
                            <tr v-for="parameter of parameters" class="border-t border-gray-200">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-90">
                                    {{ findParameterName(parameter.name) }}
                                </th>
                                <td class="px-6 py-4">
                                    {{ parameter.value }} {{ findParameterUnity(parameter.name) }}
                                </td>
                                <td class="px-6 py-4">
                                    {{ makeDateFormat(new Date(parameter.date!)) }}
                                </td>
                                <td class="px-6 py-4">
                                    {{ makeHourFormat(new Date(parameter.date!)) }}
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <th
                                    scope="row"
                                    colspan="4"
                                    class="px-6 py-4 font-medium text-gray-90"
                                >
                                    Nenhuma medição encontrada
                                </th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
        <Footer />
    </div>
</template>
