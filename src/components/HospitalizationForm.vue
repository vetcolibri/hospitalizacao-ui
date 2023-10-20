<script lang="ts" setup>
import InputField from '@/components/hospitalization/InputField.vue'
import Notification from '@/components/Notification.vue'

import { ref } from 'vue'
import type { Hospitalization } from '@/models/hospitalization'
import { COMPLAINTS, DIAGNOSIS } from '@/lib/data/hospitalization'

interface RecurringHospitalization {
    patientId: string
    name: string
    specie: string
    breed?: string
    ownerId?: string
    ownerName?: string
    ownerPhone?: string
}

defineProps<RecurringHospitalization>()

const newHospitalization = ref<Hospitalization>({
    age: 0,
    weight: 0,
    diagnostics: '',
    complaints: '',
    entryDate: '',
    dischargeDate: '',
    estimatedBudgetDate: ''
})
</script>
<template>
    <Notification />
    <form ref="form" class="space-y-3">
        <InputField
            title="ID Paciente"
            :placeholder="patientId"
            :disabled="true"
            :readonly="true"
        ></InputField>
        <div class="flex space-x-4">
            <InputField
                title="Nome do Paciente"
                :placeholder="name"
                :disabled="true"
                :readonly="true"
                class="flex-1"
            />
            <InputField
                title="Espécie"
                :placeholder="specie"
                :disabled="true"
                :readonly="true"
                :is-select="true"
                class="flex-1"
            />
        </div>
        <div class="flex space-x-4">
            <InputField
                title="Raça"
                placeholder="Bulldog"
                :disabled="true"
                :readonly="true"
                :is-select="true"
                class="flex-1"
            />
            <InputField
                title="ID Proprietário"
                placeholder="PR - 2921/KJ23"
                :disabled="true"
                :readonly="true"
                class="flex-1"
            />
        </div>
        <div class="flex space-x-4">
            <InputField
                title="Nome do Proprietário"
                placeholder="João Santos"
                :disabled="true"
                :readonly="true"
                class="flex-1"
            />
            <InputField
                title="Telemóvel"
                placeholder="933843893"
                :disabled="true"
                :readonly="true"
                class="flex-1"
            />
        </div>

        <div class="flex space-x-4">
            <InputField
                title="Idade"
                type="number"
                class="flex-1"
                v-model="newHospitalization!.age"
                :is-required="true"
            />
            <InputField
                title="Peso Kg"
                type="number"
                class="flex-1"
                v-model="newHospitalization!.weight"
                :is-required="true"
            />
        </div>

        <div>
            <label class="md:text-sm">Queixas</label>
            <select
                class="form-select form-control mt-2"
                v-model="newHospitalization!.complaints"
                required
            >
                <option value="" selected>Escolher queixas</option>
                <option v-for="complaint in COMPLAINTS" :value="complaint">
                    {{ complaint }}
                </option>
            </select>
        </div>

        <div>
            <label class="md:text-sm">Diagnosticos</label>
            <select
                class="form-select form-control mt-2"
                v-model="newHospitalization!.diagnostics"
                required
            >
                <option value="" selected>Escolher diagnosticos</option>
                <option v-for="diagnosis in DIAGNOSIS" :value="diagnosis">
                    {{ diagnosis }}
                </option>
            </select>
        </div>

        <InputField
            v-model="newHospitalization!.entryDate"
            title="Data de entrada"
            type="date"
            :is-required="true"
        />
        <InputField
            v-model="newHospitalization!.dischargeDate"
            title="Data prevista de Alta"
            type="date"
            :is-required="true"
        />
        <InputField
            v-model="newHospitalization!.estimatedBudgetDate"
            title="Orçamento previsto até"
            type="date"
            :is-required="true"
        />
    </form>
</template>
