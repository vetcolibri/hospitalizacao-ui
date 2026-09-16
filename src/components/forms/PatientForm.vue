<script setup lang="ts">
import BaseInput from '@/components/BaseInput.vue';
import ChooseBreed from '@/components/forms/ChooseBreed.vue';
import type { PatientPresetModel } from '@/lib/models/patient';
import { Provided } from '@/lib/provided';
import type { PatientService } from '@/lib/services/patient_service';
import { findBreed } from '@/lib/shared/find_breed';
import { toDateInputValue } from '@/lib/shared/format_date';
import { inject, ref, watch } from 'vue';

const props = defineProps<{ preset?: PatientPresetModel }>();

const emits = defineEmits<{
    (e: 'patient', value: object): void;
    (e: 'searching', value: boolean): void;
}>();

const patientData = ref<{
    systemId?: string;
    patientId: string;
    name: string;
    specie: string;
    breed: string;
    birthDate: string;
    ownerId?: string;
    exists: boolean;
}>({ patientId: '', name: '', specie: '', breed: '', birthDate: '', exists: false });

const patientService = <PatientService>inject(Provided.PatientService)!;

const breeds = ref<string[]>([]);

// Uma selecção da pesquisa unificada bloqueia TAMBÉM o ID Paciente, para não
// poder ser trocado localmente sem invalidar a pesquisa. A pesquisa directa por
// ID (fluxo antigo) mantém o campo editável.
const presetActive = ref(false);

function chooseSpecie(event: Event) {
    const specie = (event.target as HTMLSelectElement)?.value;
    breeds.value = findBreed(specie);

    patientData.value.specie = specie;
    patientData.value.breed = '';

    emitPatient();
}

async function findPatient(patientId: string) {
    // Qualquer alteração ao ID invalida já a selecção anterior: enquanto a
    // pesquisa decorre não pode ser hospitalizado o paciente anterior.
    patientData.value.exists = false;
    patientData.value.systemId = undefined;
    emitPatient();

    if (!patientId) {
        emits('searching', false);
        return;
    }

    emits('searching', true);

    const patientOrErr = await patientService.searchPatient(patientId);

    // Ignora uma resposta antiga se o utilizador continuou a escrever.
    if (patientData.value.patientId !== patientId) return;

    emits('searching', false);

    if (patientOrErr.isLeft() || !patientOrErr.value) {
        patientData.value = {
            patientId,
            name: '',
            specie: '',
            breed: '',
            birthDate: '',
            exists: false
        };

        emitPatient();
        return;
    }

    const patient = patientOrErr.value;

    patientData.value = {
        systemId: patient.systemId,
        birthDate: toDateInputValue(patient.birthDate),
        breed: patient.breed,
        name: patient.name,
        patientId: patient.patientId,
        specie: patient.specie,
        exists: true,
        ownerId: patient.ownerId
    };

    breeds.value = findBreed(patient.specie);
    emitPatient();
}

function emitPatient() {
    emits('patient', patientData.value);
}

// Uma selecção da pesquisa unificada preenche e bloqueia o paciente existente;
// quando é invalidada (editar o termo ou "criar novo"), volta ao modo editável.
watch(
    () => props.preset,
    (preset) => {
        if (preset) {
            presetActive.value = true;
            patientData.value = { ...preset, exists: true };
            breeds.value = findBreed(preset.specie);
            emitPatient();
            return;
        }

        presetActive.value = false;
        patientData.value = {
            patientId: '',
            name: '',
            specie: '',
            breed: '',
            birthDate: '',
            exists: false
        };
        breeds.value = [];
        emitPatient();
    }
);

/** Repõe o formulário em modo "paciente novo" (após submissão com sucesso). */
function clear() {
    presetActive.value = false;
    patientData.value = {
        patientId: '',
        name: '',
        specie: '',
        breed: '',
        birthDate: '',
        exists: false
    };
    breeds.value = [];
    emitPatient();
}

defineExpose({ clear });
</script>
<template>
    <div class="space-y-3">
        <BaseInput
            placeholder="ID do Paciente"
            data-field="patientData.patientId"
            v-model="patientData.patientId"
            :required="true"
            :disabled="presetActive"
            @update:model-value="findPatient($event)"
        />

        <BaseInput
            placeholder="Nome do Paciente"
            data-field="patientData.name"
            v-model="patientData.name"
            required
            :disabled="patientData.exists"
            @update:model-value="emitPatient()"
        />

        <div class="form-container">
            <div class="flex-1">
                <select
                    class="form-control"
                    data-field="patientData.specie"
                    required
                    :disabled="patientData.exists"
                    :value="patientData.specie"
                    @change="chooseSpecie($event)"
                >
                    <option value="" selected>Escolher Espécie</option>
                    <option value="CANINO">CANINO</option>
                    <option value="FELINO">FELINO</option>
                    <option value="AVES">AVES</option>
                    <option value="EXOTICO">EXÓTICO</option>
                    <option value="EXOTICO - MACACO">EXÓTICO - MACACO</option>
                    <option value="EXOTICO - PAPAGAIO">EXÓTICO - PAPAGAIO</option>
                </select>
            </div>

            <ChooseBreed
                class="flex-1"
                title="Escolher Raça"
                data-field="patientData.breed"
                v-model="patientData.breed"
                :breeds="breeds"
                @update:model-value="emitPatient()"
            />
        </div>

        <BaseInput
            title="Data de nascimento"
            type="date"
            placeholder="Data de nascimento"
            data-field="patientData.birthDate"
            required
            v-model="patientData.birthDate"
            :disabled="patientData.exists"
            @update:model-value="emitPatient()"
        />
    </div>
</template>
