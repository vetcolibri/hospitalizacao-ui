<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import Button from '@/components/Button.vue'
import ExamTime from '@/components/ExamTime.vue'
import HeartRate from '@/components/ParameterHeartRate.vue'
import RespiratoryRate from '@/components/ParameterRespiratoryRate.vue'
import TRC from '@/components/ParameterTRC.vue'
import AVDN from '@/components/ParameterAVDN.vue'
import Mucosas from '@/components/ParameterMucosas.vue'
import Temperature from '@/components/ParameterTemperature.vue'
import Glicemia from '@/components/ParameterGlicemia.vue'
import HCT from '@/components/ParameterHCT.vue'
import BloodPressure from '@/components/ParameterBloodPressure.vue'
import Dialog from '@/components/Dialog.vue'

import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { parameters } from '@/lib/data/parameters'

const dailyRound = ref(parameters)
const scheduleAlert = ref<boolean>(false)
const dialogElement = ref<typeof Dialog>()
const router = useRouter()
const route = useRoute()
const patientId = `${route.params.patientId}`
const form = ref<HTMLFormElement>()

function openResume() {
    if (!form.value?.checkValidity()) {
        return form.value?.reportValidity()
    }
    const parameters = Object.values(dailyRound.value)
    dialogElement.value?.addParameters(parameters)
    dialogElement.value?.show()
}

function confirm() {
    dialogElement.value?.close()
    if (scheduleAlert.value) {
        return router.push({ name: 'ScheduleAlert' })
    }
    return router.push({ name: 'ExamGeneralCondition' })
}
</script>
<template>
    <div>
        <Header title="Ronda diária">
            <GoBack />
        </Header>
        <main class="main-content py-8">
            <section class="bg-white shadow px-8 py-6">
                <ExamTime />
                <form ref="form" class="grid grid-row-1 space-y-4">
                    <HeartRate
                        :name="parameters.heartRate.name"
                        :title="parameters.heartRate.title"
                        :helpText="parameters.heartRate.helpText"
                        v-model="parameters.heartRate.measurement"
                    />
                    <RespiratoryRate
                        :name="parameters.respiratoryRate.name"
                        :title="parameters.respiratoryRate.title"
                        :helpText="parameters.respiratoryRate.helpText"
                        v-model="parameters.respiratoryRate.measurement"
                    />
                    <TRC
                        :name="parameters.trc.name"
                        :title="parameters.trc.title"
                        :helpText="parameters.trc.helpText"
                        v-model="parameters.trc.measurement"
                    />
                    <AVDN
                        :name="parameters.avdn.name"
                        :title="parameters.avdn.title"
                        :options="parameters.avdn.options"
                        v-model="parameters.avdn.measurement"
                    />
                    <Mucosas
                        :name="parameters.mucosas.name"
                        :title="parameters.mucosas.title"
                        :options="parameters.mucosas.options"
                        v-model="parameters.mucosas.measurement"
                    />

                    <Temperature
                        :name="parameters.temperature.name"
                        :title="parameters.temperature.title"
                        :helpText="parameters.temperature.helpText"
                        v-model="parameters.temperature.measurement"
                    />
                    <Glicemia
                        :name="parameters.glicemia.name"
                        :title="parameters.glicemia.title"
                        :helpText="parameters.glicemia.helpText"
                        v-model="parameters.glicemia.measurement"
                    />
                    <HCT
                        :name="parameters.hct.name"
                        :title="parameters.hct.title"
                        :helpText="parameters.hct.helpText"
                        v-model="parameters.hct.measurement"
                    />
                    <BloodPressure
                        :name="parameters.bloodPressure.name"
                        :title="parameters.bloodPressure.title"
                        :type="parameters.bloodPressure.type"
                        :helpText="parameters.bloodPressure.helpText"
                        v-model="parameters.bloodPressure.measurement"
                    />
                    <div class="flex items-center">
                        <input
                            type="checkbox"
                            class="focus:ring-0 rounded"
                            v-model="scheduleAlert"
                        />
                        <label
                            class="ml-2 block text-gray-900"
                            @click="() => (scheduleAlert = !scheduleAlert)"
                        >
                            Criar alerta de monitorização
                        </label>
                    </div>
                </form>
            </section>
        </main>
        <Footer>
            <Button class="btn-success" title="Salvar" @click="openResume()" />
        </Footer>
        <Dialog ref="dialogElement" title="Detalhes">
            <Button class="btn-secondary" title="Confirmar" @click="confirm()" />
        </Dialog>
    </div>
</template>
