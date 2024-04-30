<script setup lang="ts">
import ChooseBreed from '@/components/forms/ChooseBreed.vue'
import BaseInput from '@/components/BaseInput.vue'
import { findBreed } from '@/lib/shared/find_breed'
import { ref } from 'vue'

const patient = ref({ patientId: '', name: '', specie: '', breed: '', birthDate: '' })
const emits = defineEmits<{ (e: 'patient', value: object): void }>()
const breeds = ref<string[]>([])

function chooseSpecie(specie: string) {
    patient.value.breed = ''
    breeds.value = findBreed(specie)
    emits('patient', patient.value)
}
</script>
<template>
    <div class="space-y-3">
        <BaseInput
            placeholder="ID do Paciente"
            v-model="patient.patientId"
            :required="true"
            @update:model-value="$emit('patient', patient)"
        />

        <BaseInput
            placeholder="Nome do Paciente"
            v-model="patient.name"
            :required="true"
            @update:model-value="$emit('patient', patient)"
        />

        <div class="form-container">
            <div class="flex-1">
                <select
                    class="form-control"
                    required
                    v-model="patient.specie"
                    @change="chooseSpecie(patient.specie)"
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
                :value="patient.breed"
                :breeds="breeds"
                @choose="patient.breed = $event"
            />
        </div>

        <BaseInput
            title="Data de nascimento"
            type="date"
            placeholder="Data de nascimento"
            v-model="patient.birthDate"
            :required="true"
            @update:model-value="$emit('patient', patient)"
        />
    </div>
</template>
