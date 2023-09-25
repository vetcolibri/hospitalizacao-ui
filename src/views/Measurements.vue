<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

import { makeHourFormat } from '@/lib/shared/utils'
import { Measurement } from '@/models/measurement'

const measurements = ref<Measurement[]>([])
</script>
<template>
    <div>
        <Header title="Medições">
            <GoBack />
        </Header>
        <main class="main-content py-8">
            <section class="container">
                <router-link
                    :to="{ name: 'DailyRound', params: { patientId: $route.params.patientId } }"
                >
                    Ronda Diária
                </router-link>
                <router-link
                    :to="{
                        name: 'ChooseParameters',
                        params: { patientId: $route.params.patientId }
                    }"
                >
                    Monitorização continuada
                </router-link>
                <table>
                    <thead>
                        <tr>
                            <th>Parâmetro</th>
                            <th>Medição</th>
                            <th>Hora</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="measurment of measurements">
                            <td>{{ measurment.parameter }}</td>
                            <td>{{ measurment.value }}</td>
                            <td>{{ makeHourFormat(new Date(measurment.date!)) }}</td>
                            <td>{{ measurment.date }}</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </main>

        <Footer />
    </div>
</template>
