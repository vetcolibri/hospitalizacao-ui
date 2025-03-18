<script setup lang="ts">
import BaseInput from '@/components/BaseInput.vue';
import ChooseBreed from '@/components/forms/ChooseBreed.vue';
import type { PatientModel } from '@/lib/models/patient';
import { Provided } from '@/lib/provided';
import type { PatientService } from '@/lib/services/patient_service';
import { findBreed } from '@/lib/shared/find_breed';
import { inject, onMounted, ref } from 'vue';

const emits = defineEmits<{ (e: 'patient', value: object): void }>();

const patientData = ref<{
    patientId: string;
    name: string;
    specie: string;
    breed: string;
    birthDate: string;
    ownerId?: string;
    exists: boolean;
}>({ patientId: '', name: '', specie: '', breed: '', birthDate: '', exists: false });

const patientService = <PatientService>inject(Provided.PatientService)!;

const patients = ref<PatientModel[]>([]);
const breeds = ref<string[]>([]);

function chooseSpecie(specie: string) {
    breeds.value = findBreed(specie);

    patientData.value.specie = specie;
    patientData.value.breed = '';

    emitPatient();
}

function findPatient(patientId: string) {
    if (!patientId) {
        return;
    }

    const patient = patients.value.find((o) => o.patientId === patientId);

    if (!patient) {
        patientData.value.patientId = patientId;
        patientData.value.exists = false;

        emitPatient();
        return;
    }

    patientData.value = {
        birthDate: patient.birthDate,
        breed: patient.breed,
        name: patient.name,
        patientId: patient.patientId,
        specie: patient.specie,
        exists: true,
        ownerId: patient.ownerId
    };

    emitPatient();
}

function emitPatient() {
    emits('patient', patientData.value);
}

onMounted(() => {
    patientService.listNonHospitalized().then((patientsOrErr) => {
        if (patientsOrErr.isLeft()) {
            console.error(patientsOrErr.value);
            return;
        }

        patients.value = patientsOrErr.value;
    });
});
</script>
<template>
    <div class="space-y-3">
        <BaseInput
            placeholder="ID do Paciente"
            v-model="patientData.patientId"
            :required="true"
            @update:model-value="findPatient($event)"
        />

        <BaseInput
            placeholder="Nome do Paciente"
            v-model="patientData.name"
            required
            :disabled="patientData.exists"
            @update:model-value="emitPatient()"
        />

        <div class="form-container">
            <div class="flex-1">
                <select
                    class="form-control"
                    required
                    :disabled="patientData.exists"
                    :value="patientData.specie"
                    @change="chooseSpecie(patientData.specie ?? '')"
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
                :value="patientData.breed"
                :breeds="breeds"
                @choose="emitPatient()"
            />
        </div>

        <BaseInput
            title="Data de nascimento"
            type="date"
            placeholder="Data de nascimento"
            required
            v-model="patientData.birthDate"
            :disabled="patientData.exists"
            @update:model-value="emitPatient()"
        />
    </div>
</template>
