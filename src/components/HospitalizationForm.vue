<script lang="ts" setup>
import InputField from '@/components/hospitalization/InputField.vue'
import Notification from '@/components/Notification.vue'

import { ref } from 'vue'
import { COMPLAINTS, DIAGNOSIS } from '@/lib/data/hospitalization'
import type { Hospitalization } from '@/models/hospitalization'
import type { Patient } from '@/models/patient'

interface Props {
    patient?: Patient
}

interface Emits {
    (e: 'sendData', h: Hospitalization): void
}

const newHospitalization = ref<Hospitalization>({
    age: 0,
    weight: 0,
    diagnostics: '',
    complaints: '',
    entryDate: '',
    dischargeDate: '',
    estimatedBudgetDate: ''
})

defineEmits<Emits>()
defineProps<Props>()
</script>
<template>
    <Notification />
    <form v-if="patient" ref="form" class="space-y-3">
        <InputField
            title="ID Paciente"
            :placeholder="patient?.patientId"
            :disabled="true"
            :readonly="true"
        ></InputField>
        <div class="flex space-x-4">
            <InputField
                title="Nome do Paciente"
                :placeholder="patient?.name"
                :disabled="true"
                :readonly="true"
                class="flex-1"
            />
            <InputField
                title="Espécie"
                :placeholder="patient?.specie"
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
                @input="$emit('sendData', newHospitalization)"
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
    <form v-else ref="form" class="space-y-3">
        <div class="flex items-center space-x-4">
            <InputField
                title="Nome do Paciente"
                class="flex-1"
                placeholder="Nome do Paciente"
                :is-required="true"
                v-model="newHospitalization.name"
                @input="$emit('sendData', newHospitalization)"
            />
            <div class="flex-1">
                <label class="md:text-sm">Espécie</label>
                <select
                    class="form-select form-control"
                    required
                    @input="$emit('sendData', newHospitalization)"
                >
                    <option value="" selected>Escolher espécie</option>
                    <option value="canino">CANINO</option>
                    <option value="felino">FELINO</option>
                </select>
            </div>
        </div>
        <div class="flex space-x-4">
            <InputField title="Raça" class="flex-1" placeholder="Raça" :is-required="true" />
            <InputField
                title="ID Proprietário"
                class="flex-1"
                placeholder="ID Próprietário"
                :is-required="true"
            />
        </div>
        <div class="flex space-x-4">
            <InputField
                title="Nome do Proprietário"
                class="flex-1"
                placeholder="Nome do Proprietário"
                :is-required="true"
            />
            <InputField
                title="Telemóvel"
                class="flex-1"
                placeholder="Telemóvel"
                :is-required="true"
            />
        </div>
        <div class="flex space-x-4">
            <InputField
                title="Idade"
                type="number"
                class="flex-1"
                placeholder="Idade"
                :is-required="true"
                v-model="newHospitalization.age"
                @input="$emit('sendData', newHospitalization)"
            />
            <InputField
                title="Peso Kg"
                type="number"
                class="flex-1"
                placeholder="Peso Kg"
                :is-required="true"
            />
        </div>
        <div>
            <label class="md:text-sm">Queixas</label>
            <select class="form-select form-control mt-2" required>
                <option value="" selected>Escolher queixas</option>
                <option v-for="complaint in COMPLAINTS" :value="complaint">
                    {{ complaint }}
                </option>
            </select>
        </div>
        <div>
            <label class="md:text-sm">Diagnosticos</label>
            <select class="form-select form-control mt-2" required>
                <option value="" selected>Escolher diagnosticos</option>
                <option v-for="diagnosis in DIAGNOSIS" :value="diagnosis">
                    {{ diagnosis }}
                </option>
            </select>
        </div>
        <InputField title="Data de entrada" type="date" :is-required="true" />
        <InputField title="Data prevista de Alta" type="date" :is-required="true" />
        <InputField title="Orçamento previsto até" type="date" :is-required="true" />
    </form>
</template>
