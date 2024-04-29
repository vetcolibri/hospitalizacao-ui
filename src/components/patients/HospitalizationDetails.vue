<script setup lang="ts">
import { usePageData } from '@/composables/usePageData'
import type { HospitalizationModel } from '@/lib/models/hospitalization'
import { Provided } from '@/lib/provided'
import type { PatientService } from '@/lib/services/patient_service'
import { formatDate } from '@/lib/shared/format_date'
import { inject } from 'vue'

interface Props {
    hospitalization?: HospitalizationModel
    active: boolean
}

interface Emits {
    (e: 'closeDialog'): void
}

const emits = defineEmits<Emits>()
const service = inject<PatientService>(Provided.PatientService)!

async function endHospitalization(patientId?: string) {
    if (!patientId) return

    await service.endHospitalization(patientId)

    emits('closeDialog')
}

withDefaults(defineProps<Props>(), { active: false })
</script>

<template>
    <div v-show="active" class="space-y-3">
        <ul class="patient-info">
            <li class="patient-info-item flex-col">
                <span>Queixas</span>
                <div class="mt-1 space-x-2 space-y-2">
                    <span v-for="complaint in hospitalization?.complaints" class="badge badge-dark">
                        {{ complaint }}
                    </span>
                </div>
            </li>
            <li class="patient-info-item flex-col">
                <span>Diagnosticos</span>
                <div class="mt-1 space-x-2 space-y-2">
                    <span
                        v-for="diagnostic in hospitalization?.diagnostics"
                        class="badge badge-dark"
                    >
                        {{ diagnostic }}
                    </span>
                </div>
            </li>
            <li class="patient-info-item">
                <span>Data de entrada</span>
                <span class="patient-info-text">
                    {{ formatDate(hospitalization?.entryDate) }}
                </span>
            </li>
            <li class="patient-info-item">
                <span>Alta prevista</span>
                <span class="patient-info-text">
                    {{ formatDate(hospitalization?.dischargeDate) }}
                </span>
            </li>
        </ul>

        <button
            class="btn btn-success w-full"
            v-if="hospitalization?.status === 'Aberta'"
            @click="endHospitalization(hospitalization?.patientId)"
        >
            ENCERRAR HOSPITALIZAÇÃO
        </button>
    </div>
</template>
