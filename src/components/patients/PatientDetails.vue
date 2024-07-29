<script setup lang="ts">
import type { PatientModel } from '@/lib/models/patient'
import type { OwnerModel } from '@/lib/models/owner'

interface Props {
    patient: PatientModel
    owner?: OwnerModel
    weight?: number
    active: boolean
}

withDefaults(defineProps<Props>(), { active: false })
</script>

<template>
    <ul v-show="active" class="patient-info">
        <li class="patient-info-item">
            <span>ID Paciente</span>
            <span class="patient-info-text">{{ patient.patientId }}</span>
        </li>
        <li class="patient-info-item">
            <span>Nome</span>
            <span class="patient-info-text">{{ patient.name }}</span>
        </li>
        <li class="patient-info-item">
            <span>Idade</span>
            <span class="patient-info-text">{{ patient.birthDate }}</span>
        </li>
        <li class="patient-info-item">
            <span>Peso (Kg)</span>
            <span class="patient-info-text">{{ weight ?? 0 }}</span>
        </li>
        <li class="patient-info-item">
            <span>Espécie</span>
            <span class="patient-info-text">{{ patient.specie }}</span>
        </li>
        <li class="patient-info-item">
            <span>Raça</span>
            <span class="patient-info-text">{{ patient.breed }}</span>
        </li>
        <li class="patient-info-item">
            <span>ID Proprietário</span>
            <span class="patient-info-text">{{ owner?.ownerId }}</span>
        </li>
        <li class="patient-info-item">
            <span>Proprietário</span>
            <span class="patient-info-text">{{ owner?.name }}</span>
        </li>
        <li class="patient-info-item">
            <span>Telemóvel</span>
            <span class="patient-info-text">{{ owner?.phoneNumber }}</span>
        </li>
        <li class="patient-info-item">
            <span>WhatsApp</span>
            <span class="patient-info-text">
                <i v-if="owner?.whatsapp" class="bi bi-check-circle-fill text-green-500"></i>
                <i v-else class="bi bi-x-circle-fill text-red-500"></i>
            </span>
        </li>
    </ul>
</template>
