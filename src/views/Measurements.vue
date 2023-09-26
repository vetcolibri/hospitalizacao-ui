<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import { RouterLink } from 'vue-router'
import { inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { makeHourFormat, makeTodayFormat } from '@/lib/shared/utils'
import { Measurement } from '@/models/measurement'
import { MeasurementService } from '@/services/measurement_service'
import { Provided } from '@/lib/provided'

const parameters = ref<Measurement[]>([])
const route = useRoute()
const patientId = `${route.params.patientId}`
const measurmentClient = inject<MeasurementService>(Provided.MEASUREMENT_SERVICE)!

const PARAMETERS = {
    heartRate: 'Frequência Cardiaca',
    respiratoryRate: 'Frequência Respiratória',
    trc: 'TRC',
    avdn: 'AVDN',
    mucosas: 'Mucosas',
    temperature: 'Temperature',
    glicemia: 'Glicemia',
    hct: 'HCT',
    bloodPressure: 'Pressão Arteiral'
}
function findParameterName(name: string) {
    const result = Object.entries(PARAMETERS).find((item) => item[0] === name)
    if (!result) return
    return result[1]
}

onMounted(async () => {
    const data = await await measurmentClient.getAllMeasurements(patientId)
    parameters.value = data.reverse()
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
                                <td class="px-6 py-4">{{ parameter.value }}</td>
                                <td class="px-6 py-4">
                                    {{ makeTodayFormat(new Date(parameter.date!)) }}
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
