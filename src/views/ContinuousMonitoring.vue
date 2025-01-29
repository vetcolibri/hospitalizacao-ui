<script setup lang="ts">
import Footer from '@/components/Footer.vue';
import GoBack from '@/components/GoBack.vue';
import Header from '@/components/Header.vue';
import BaseParameter from '@/components/parameters/BaseParameter.vue';
import Summary from '@/components/parameters/ParametersSummary.vue';
import Today from '@/components/Today.vue';

import { computed, inject, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import dailyRound from '@/lib/domain/round';
import type { MeasurementModel } from '@/lib/models/measurement';
import { Provided } from '@/lib/provided';
import type { RoundService } from '@/lib/services/round_service';
import { useParametersStore } from '@/lib/store/parametersStore';
import { useCurrentPatient } from '@/lib/store/patientStore';
import { myAlert } from '@/lib/myAlert';

const form = ref<HTMLFormElement>();
const visibleMenu = ref(false);
const optionsRef = ref();
const alertPage = ref<boolean>(false);
const router = useRouter();
const parametersSummaryRef = ref<typeof Summary>();
const parametersStore = useParametersStore();
const service = inject<RoundService>(Provided.RoundService)!;
const measurements = ref<MeasurementModel[]>([]);
const patientStore = useCurrentPatient();

const hasSomeOneVisible = computed(() => dailyRound.parameters.some((p) => p.visibility === true));

function toggleMenu() {
    visibleMenu.value = !visibleMenu.value;
}

function closeMenu(event: Event) {
    if (optionsRef.value && !optionsRef.value.contains(event.target)) {
        visibleMenu.value = false;
    }
}

function getMeasurement(parameter: string) {
    return measurements.value.find((m) => m.name === parameter);
}

function showParameter(name: string) {
    const parameter = dailyRound.parameters.find((p) => p.name === name);

    if (!parameter) return;

    parameter.toggleVisibility();
}

function showParameters() {
    if (parametersStore.getParameters.length === 0) return;

    parametersStore.getParameters.forEach(showParameter);

    parametersStore.clear();
}

function formIsInvalid() {
    return !form.value?.checkValidity() || form.value?.elements.length === 0;
}

function toggleAlertPage() {
    alertPage.value = !alertPage.value;
}

function confirm() {
    if (formIsInvalid()) return form.value?.reportValidity();

    const parameters = dailyRound.parameters.filter((p) => p.visibility === true && p.value !== '');

    parametersSummaryRef.value?.add(parameters);
    parametersSummaryRef.value?.open();
}

async function save() {
    const voidOrErr = await service.newRound(patientStore.patient.patientId, dailyRound.data);
    if (voidOrErr.isLeft()) {
        myAlert(voidOrErr.value.message, voidOrErr.value);
        return;
    }

    parametersSummaryRef.value?.close();

    dailyRound.reset();

    myAlert('Parâmetros salvos com sucesso');

    if (alertPage.value) {
        router.push({ name: 'ScheduleAlert' });
        return;
    }

    router.push({ name: 'Dashboard' });
}

onMounted(async () => {
    if (!patientStore.patient) return router.back();

    document.addEventListener('click', closeMenu);

    measurements.value = await service.latestMeasurement(patientStore.patient.patientId);

    showParameters();
});
</script>
<template>
    <Header title="Escolha os parâmetros">
        <GoBack />
    </Header>
    <main class="main-content">
        <section class="container my-8">
            <Today />
            <section class="relative space-y-2">
                <div
                    ref="optionsRef"
                    class="flex items-center border gap-3 px-2 rounded text-gray-500"
                >
                    <i class="bi bi-hand-index text-lg md:text-xl" @click="toggleMenu()"></i>
                    <div
                        class="flex-1 border-0 py-2 cursor-pointer focus:ring-0"
                        @click="toggleMenu()"
                    >
                        Escolher parâmetros
                    </div>
                    <i
                        class="bi bi-trash text-lg cursor-pointer md:text-xl"
                        @click="dailyRound.reset()"
                    ></i>
                </div>
                <div
                    v-if="visibleMenu"
                    class="absolute w-full bg-white overflow-y-auto border rounded space-y-2 p-3"
                    @click.stop
                >
                    <div
                        v-for="parameter in dailyRound.parameters"
                        :key="parameter.name"
                        class="flex items-center gap-2 text-gray-900"
                        @click="parameter.toggleVisibility()"
                    >
                        <input
                            type="checkbox"
                            class="rounded focus:ring-0"
                            :checked="parameter.visibility"
                        />
                        <label>{{ parameter.title }}</label>
                    </div>
                </div>
                <hr />
                <form ref="form" class="space-y-4">
                    <BaseParameter
                        v-for="parameter in dailyRound.parameters"
                        :key="parameter.name"
                        :parameter="parameter"
                        :measurement="getMeasurement(parameter.name)"
                        :visibility="parameter.visibility"
                        :view-lock-icon="false"
                    />

                    <div v-if="hasSomeOneVisible" class="flex items-center">
                        <input type="checkbox" class="focus:ring-0" v-model="alertPage" />
                        <label class="ml-2 block text-gray-900" @click="toggleAlertPage()">
                            Criar alerta de monitorização
                        </label>
                    </div>
                </form>
            </section>
        </section>
    </main>
    <Summary ref="parametersSummaryRef" @save="save()"></Summary>
    <Footer>
        <button class="btn btn-secondary" @click="confirm()">Confirmar</button>
    </Footer>
</template>
