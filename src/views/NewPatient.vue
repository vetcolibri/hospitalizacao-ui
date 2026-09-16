<script setup lang="ts">
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import GoBack from '@/components/GoBack.vue';
import PatientForm from '@/components/forms/PatientForm.vue';
import PatientSearch from '@/components/forms/PatientSearch.vue';
import HospitalizationForm from '@/components/forms/HospitalizationForm.vue';
import OwnerForm from '@/components/forms/OwnerForm.vue';
import BudgetForm from '@/components/forms/BudgetForm.vue';

import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
import { Provided } from '@/lib/provided';
import type { PatientService } from '@/lib/services/patient_service';
import type {
    PatientModel,
    PatientPresetModel,
    PatientSearchResultModel
} from '@/lib/models/patient';

const patientService = <PatientService>inject(Provided.PatientService)!;

const form = ref<HTMLFormElement>();
type FormPatient = Partial<PatientModel> & { exists?: boolean };
const patientData = ref<FormPatient>({});
const ownerData = ref();
const hospitalizationData = ref();
const budgetData = ref();
const hospitalizationFormRef = ref<typeof HospitalizationForm>();
const ownerFormRef = ref<typeof OwnerForm>();
const patientFormRef = ref<typeof PatientForm>();
const patientSearchRef = ref<typeof PatientSearch>();

const wakeLock = ref<WakeLockSentinel | undefined>();
const searchingPatient = ref(false);
const searchingUnified = ref(false);
const pendingOwner = ref(false);

// Paciente escolhido na pesquisa unificada. Enquanto existir, o formulário do
// paciente fica preenchido e bloqueado; qualquer edição ao termo (ou "criar
// novo") invalida-o de imediato.
const searchSelection = ref<PatientSearchResultModel>();

const searchPreset = computed<PatientPresetModel | undefined>(() => {
    const selected = searchSelection.value;
    if (!selected) return undefined;

    return {
        systemId: selected.systemId,
        patientId: selected.patientId,
        name: selected.patientName,
        specie: selected.specie,
        breed: selected.breed,
        birthDate: selected.birthDate,
        ownerId: selected.ownerId
    };
});

function selectSearchedPatient(result: PatientSearchResultModel) {
    searchSelection.value = result;
}

function invalidateSearchSelection() {
    // Só invalida quando havia uma selecção: editar o termo não pode apagar um
    // rascunho de paciente novo que nunca foi uma selecção.
    if (!searchSelection.value) return;

    searchSelection.value = undefined;
}

function focusNewPatient() {
    const field = form.value?.querySelector<HTMLInputElement>('input[placeholder="ID do Paciente"]');
    field?.focus();
}

async function hospitalize() {
    // Enquanto a pesquisa do paciente (exacta ou unificada) decorre não há
    // selecção válida: submeter poderia hospitalizar o paciente pesquisado
    // anteriormente. Enquanto o tutor do paciente seleccionado está por
    // resolver, a hospitalização gravaria outro tutor.
    if (searchingPatient.value || searchingUnified.value || pendingOwner.value) return;

    if (!form.value?.checkValidity()) return form.value?.reportValidity();

    const systemId = patientData.value.systemId;
    const isExistingPatient = patientData.value.exists === true && !!systemId;

    // Para um paciente existente, envia a correcção dos dados globais do tutor
    // apenas quando o utilizador a efectuou.
    const ownerChange = isExistingPatient ? ownerFormRef.value?.ownerChange?.() : undefined;

    const result = isExistingPatient
        ? await patientService.newHospitalization(
              systemId as string,
              hospitalizationData.value,
              budgetData.value,
              ownerChange
          )
        : await patientService.newPatient({
              // Cópia: o estado do formulário é limpo após o sucesso e não pode
              // alterar o pedido já enviado.
              patientData: { ...patientData.value } as PatientModel,
              ownerData: ownerData.value,
              hospitalizationData: hospitalizationData.value,
              budgetData: budgetData.value
          });

    if (result.isLeft()) {
        let firstInvalidField: HTMLInputElement | HTMLSelectElement | undefined;
        for (const issue of result.value.errors ?? []) {
            const container = form.value?.querySelector<HTMLElement>(
                `[data-field="${CSS.escape(issue.path)}"]`
            );
            const field = container instanceof HTMLInputElement || container instanceof HTMLSelectElement
                ? container
                : container?.querySelector('input, select');
            if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) {
                field.setCustomValidity(issue.message);
                firstInvalidField ??= field;
            }
        }
        firstInvalidField?.reportValidity();
        return;
    }

    // Submissão aceite: limpa TODO o estado do formulário, incluindo a pesquisa
    // unificada e a selecção, para não sobrar nada do paciente anterior nem
    // permitir resubmetê-lo. O tutor é também limpo.
    searchSelection.value = undefined;
    patientSearchRef.value?.clear();
    patientFormRef.value?.clear();
    hospitalizationFormRef.value?.clear();
    ownerFormRef.value?.clear();

    form.value?.reset();
}

function clearFieldError(event: Event) {
    const field = event.target;
    if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) {
        field.setCustomValidity('');
    }
}

function checkPatient(patient: Partial<PatientModel> & { exists?: boolean }) {
    patientData.value.patientId = patient.patientId;
    patientData.value.name = patient.name;
    patientData.value.specie = patient.specie;
    patientData.value.breed = patient.breed;
    patientData.value.birthDate = patient.birthDate;
    patientData.value.systemId = patient.systemId;
    patientData.value.exists = patient.exists;

    if (patient.exists) {
        void ownerFormRef.value?.findOwner(patient.ownerId);
        return;
    }

    // O paciente passa a ser novo: o tutor do paciente anterior não pode ser herdado.
    ownerFormRef.value?.clear();
}

onMounted(async () => {
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
    <Header title="Nova hospitalização">
        <GoBack />
    </Header>
    <main class="main-content text-gray-500">
        <form ref="form" @input="clearFieldError">
            <section class="container rounded my-4">
                <h1 class="font-medium">Paciente</h1>
                <p class="text-sm text-gray-500">
                    Preencha os campos abaixo com os dados do paciente.
                </p>

                <PatientSearch
                    ref="patientSearchRef"
                    @select="selectSearchedPatient($event)"
                    @clear="invalidateSearchSelection()"
                    @new="focusNewPatient()"
                    @searching="searchingUnified = $event"
                />

                <PatientForm
                    ref="patientFormRef"
                    :preset="searchPreset"
                    @patient="checkPatient($event)"
                    @searching="searchingPatient = $event"
                />

                <OwnerForm
                    ref="ownerFormRef"
                    @owner="ownerData = $event"
                    @pending="pendingOwner = $event"
                />
            </section>

            <HospitalizationForm
                ref="hospitalizationFormRef"
                @hospitalization="hospitalizationData = $event"
            />

            <BudgetForm @budget="budgetData = $event" />
        </form>
    </main>
    <Footer>
        <button
            class="btn btn-success space-x-2"
            :disabled="searchingPatient || searchingUnified || pendingOwner"
            @click="hospitalize()"
        >
            <i class="bi bi-floppy2"></i>
            <span class="font-medium">Hospitalizar</span>
        </button>
    </Footer>
</template>
