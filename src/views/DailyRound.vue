<script setup lang="ts">
import Footer from '@/components/Footer.vue';
import GoBack from '@/components/GoBack.vue';
import Header from '@/components/Header.vue';
import BaseParameter from '@/components/parameters/BaseParameter.vue';
import ParametersSummary from '@/components/parameters/ParametersSummary.vue';
import Today from '@/components/Today.vue';

import { inject, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import dailyRound from '@/lib/domain/round';
import type { MeasurementModel } from '@/lib/models/measurement';
import { Provided } from '@/lib/provided';
import { RoundServiceImpl } from '@/lib/services/round_service';
import { useCurrentPatient } from '@/lib/store/patientStore';
import { myAlert } from '@/lib/myAlert';

const form = ref<HTMLFormElement>();
const alertPage = ref<boolean>(false);
const summaryRef = ref<typeof ParametersSummary>();
const measurements = ref<MeasurementModel[]>([]);
const router = useRouter();
const roundService = inject<RoundServiceImpl>(Provided.RoundService)!;
const patientStore = useCurrentPatient();

const wakeLock = ref<WakeLockSentinel | undefined>();

function toggleAlertPage() {
    alertPage.value = !alertPage.value;
}

function getMeasurement(parameter: string) {
    return measurements.value.find((m) => m.name === parameter);
}

async function save() {
    const voidOrErr = await roundService.newRound(patientStore.patient.patientId, dailyRound.data);
    if (voidOrErr.isLeft()) {
        myAlert('Erro ao salvar os parâmetros', voidOrErr.value);
        return;
    }

    myAlert('Parâmetros salvos com sucesso');

    summaryRef.value?.close();

    if (alertPage.value) {
        router.push({ name: 'ScheduleAlert' });
        return;
    }

    dailyRound.reset();

    router.push({ name: 'Dashboard' });
}

function confirm() {
    if (!form.value?.checkValidity()) return form.value?.reportValidity();

    summaryRef.value?.add(dailyRound.parameters);

    summaryRef.value?.open();
}

onMounted(async () => {
    if (!patientStore.patient) {
        return router.back();
    }

    measurements.value = await roundService.latestMeasurement(patientStore.patient.patientId);
    if ('wakeLock' in navigator) {
        console.log('Screen Wake Lock API suportada!');
    } else {
        console.log('Screen Wake Lock API não suportada.');
        return;
    }

    try {
        wakeLock.value = await navigator.wakeLock.request('screen');
        console.log('Tela bloqueada com sucesso!');
    } catch (err) {
        console.error('Falha ao bloquear a tela:', err);
    }
});

onUnmounted(async () => {
    await wakeLock.value?.release();
    console.log('Tela desbloqueada com sucesso!');
});
</script>
<template>
    <Header title="Ronda diária">
        <GoBack />
    </Header>

    <main class="main-content">
        <section class="container my-8">
            <div class="flex items-center justify-between"></div>
            <Today />
            <form ref="form" class="space-y-4">
                <BaseParameter
                    v-for="parameter in dailyRound.parameters"
                    :key="parameter.name"
                    :parameter="parameter"
                    :measurement="getMeasurement(parameter.name)"
                />

                <div class="flex items-center gap-2">
                    <input type="checkbox" class="focus:ring-0" v-model="alertPage" />
                    <label class="block text-gray-900" @click="toggleAlertPage()">
                        Criar alerta de monitorização
                    </label>
                </div>
            </form>
        </section>
    </main>

    <ParametersSummary ref="summaryRef" @save="save()" />
    <Footer>
        <button class="btn btn-secondary" @click="confirm()">Confirmar</button>
    </Footer>
</template>
