<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import ExamTime from '@/components/ExamTime.vue'
import HeartRate from '@/components/parameters/ParameterHeartRate.vue'
import RespiratoryRate from '@/components/parameters/ParameterRespiratoryRate.vue'
import Trc from '@/components/parameters/ParameterTrc.vue'
import Avdn from '@/components/parameters/ParameterAvdn.vue'
import Mucosas from '@/components/parameters/ParameterMucosas.vue'
import Temperature from '@/components/parameters/ParameterTemperature.vue'
import Glicemia from '@/components/parameters/ParameterGlicemia.vue'
import Hct from '@/components/parameters/ParameterHct.vue'
import Summary from '@/components/parameters/ParametersSummary.vue'
import BloodPressure from '@/components/parameters/ParameterBloodPressure.vue'

import { inject, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { Measurement } from '@/models/measurement'
import { MeasurementServiceAPI } from '@/services/measurement_service'
import { Provided } from '@/lib/provided'
import { states } from '@/lib/data/parameters_state'

const route = useRoute()
const router = useRouter()
const parametersState = ref(states)
const alertCheckbox = ref<boolean>(false)
const form = ref<HTMLFormElement>()
const parametersSummaryRef = ref<typeof Summary>()
const latestMeasurements = ref<Measurement[]>([])
const patientId = `${route.params.patientId}`
const measurmentClient = inject<MeasurementServiceAPI>(Provided.MEASUREMENT_SERVICE)!

function confirm() {
    if (!form.value?.checkValidity()) {
        return form.value?.reportValidity()
    }
    parametersSummaryRef.value?.addParameters(Object.values(parametersState.value))
    parametersSummaryRef.value?.open()
    if (alertCheckbox.value) {
        parametersSummaryRef.value?.close()
        return router.push({ name: 'ScheduleAlert', params: { patientId } })
    }
}

onBeforeMount(async () => {})
</script>
<template>
    <Header title="Ronda diária">
        <GoBack />
    </Header>
    <main class="main-content">
        <section class="px-12">
            <section class="container mt-8">
                <ExamTime />
                <form ref="form">
                    <div class="space-y-4">
                        <HeartRate
                            v-model="parametersState.heartRate.value"
                            @state="parametersState.heartRate.state = $event"
                        />
                        <RespiratoryRate
                            v-model="parametersState.respiratoryRate.value"
                            @state="parametersState.respiratoryRate.state = $event"
                        />
                        <Trc
                            v-model="parametersState.trc.value"
                            @state="parametersState.trc.state = $event"
                        />
                        <Avdn
                            v-model="parametersState.avdn.value"
                            @state="parametersState.avdn.state = $event"
                        />
                        <Mucosas
                            v-model="parametersState.mucosas.value"
                            @state="parametersState.mucosas.state = $event"
                        />
                        <Temperature
                            v-model="parametersState.temperature.value"
                            @state="parametersState.temperature.state = $event"
                        />
                        <Glicemia
                            v-model="parametersState.glicemia.value"
                            @state="parametersState.glicemia.state = $event"
                        />
                        <Hct
                            v-model="parametersState.hct.value"
                            @state="parametersState.hct.state = $event"
                        />
                        <BloodPressure
                            v-model="parametersState.bloodPressure.value"
                            @state="parametersState.bloodPressure.state = $event"
                        />
                        <div class="flex items-center">
                            <input
                                type="checkbox"
                                class="focus:ring-0 rounded"
                                v-model="alertCheckbox"
                            />
                            <label
                                class="ml-2 block text-gray-900"
                                @click="() => (alertCheckbox = !alertCheckbox)"
                            >
                                Criar alerta de monitorização
                            </label>
                        </div>
                    </div>
                </form>
            </section>
        </section>
    </main>
    <Summary ref="parametersSummaryRef">
        <button class="btn btn-success space-x-3">
            <i class="bi bi-floppy2"></i>
            <span class="font-semibold">Salvar</span>
        </button>
    </Summary>
    <Footer>
        <button type="button" class="btn-secondary" @click="confirm">Confirmar</button>
    </Footer>
</template>
