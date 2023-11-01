<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import InputField from '@/components/hospitalization/InputField.vue'

import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Provided } from '@/lib/provided'
import { COMPLAINTS } from '@/lib/data/complaints'
import { DIAGNOSTICS } from '@/lib/data/diagnostics'
import { BREEDS } from '@/lib/data/breeds'
import type { Hospitalization, Budget } from '@/models/hospitalization'
import type { PatientService } from '@/services/patient_service'
import { Patient } from '@/models/patient'

const router = useRouter()
const patientService = <PatientService>inject(Provided.PATIENT_SERVICE)!
const status = ref<string>('Hospitalizar')
const form = ref<HTMLFormElement>()

const patient = ref<Patient>({
    name: '',
    patientId: '',
    specie: '',
    breed: '',
    ownerId: '',
    ownerName: '',
    ownerPhoneNumber: ''
})
const hospitalization = ref<Hospitalization>({
    birthDate: '',
    weight: 0,
    diagnostics: '',
    complaints: '',
    entryDate: '',
    dischargeDate: '',
    estimatedBudgetDate: ''
})

const budget = ref<Budget>({
    startDate: '',
    endDate: '',
    status: ''
})

async function hospitalize() {
    if (!form.value?.checkValidity()) return form.value?.reportValidity()
    status.value = 'A hospitalizar...'
    alert('Paciente hospitalizado com sucesso.')
    router.push({ name: 'Dashboard' })
}
</script>

<template>
    <Header title="Nova hospitalização">
        <GoBack />
    </Header>
    <main class="main-content">
        <section class="px-12">
            <section class="container rounded mt-8 mb-4">
                <h1 class="font-medium">Paciente</h1>
                <p class="text-sm text-gray-500">
                    Preencha os campos abaixo com os dados do paciente.
                </p>
                <InputField
                    placeholder="Nome do Paciente"
                    v-model="patient.name"
                    :is-required="true"
                />
                <div class="flex items-center space-x-4">
                    <InputField
                        class="flex-1"
                        placeholder="ID do Paciente"
                        v-model="patient.patientId"
                        :is-required="true"
                    />
                    <div class="flex-1">
                        <select class="form-control" required v-model="patient.specie">
                            <option value="" selected>Escolher Espécie</option>
                            <option value="CANINO">CANINO</option>
                            <option value="FELINO">FELINO</option>
                            <option value="AVES">AVES</option>
                            <option value="EXOTICO">EXÓTICO</option>
                        </select>
                    </div>
                </div>
                <div class="flex space-x-4">
                    <div class="flex-1">
                        <select class="form-control" required v-model="patient.breed">
                            <option value="" selected>Escolher Raça</option>
                            <optgroup label="Cães">
                                <option v-for="breed in BREEDS.caes" :value="breed">
                                    {{ breed }}
                                </option>
                            </optgroup>
                            <optgroup label="Gatos">
                                <option v-for="breed in BREEDS.gatos" :value="breed">
                                    {{ breed }}
                                </option>
                            </optgroup>
                        </select>
                    </div>
                    <InputField
                        class="flex-1"
                        placeholder="ID Próprietário"
                        v-model="patient.ownerId"
                        :is-required="true"
                    />
                </div>
                <div class="flex space-x-4">
                    <InputField
                        class="flex-1"
                        placeholder="Nome do Proprietário"
                        v-model="patient.ownerName"
                        :is-required="true"
                    />
                    <InputField
                        class="flex-1"
                        placeholder="Telemóvel"
                        v-model="patient.ownerPhoneNumber"
                        :is-required="true"
                    />
                </div>
            </section>
            <section class="container rounded mb-4">
                <h1 class="font-medium text-base">Hospitalização</h1>
                <p class="text-sm text-gray-500">
                    Preencha os campos abaixo com os dados da hospitalização.
                </p>
                <div class="flex space-x-4">
                    <InputField
                        title="Data de nascimento"
                        type="date"
                        class="flex-1 text-gray-500"
                        placeholder="Data de nascimento"
                        v-model="hospitalization.birthDate"
                        :is-required="true"
                    />
                    <InputField
                        title="Peso Kg"
                        type="number"
                        class="flex-1 text-gray-500"
                        placeholder="Peso Kg"
                        v-model="hospitalization.weight"
                        :is-required="true"
                        :max="100"
                        :min="1"
                    />
                </div>
                <div>
                    <select class="form-control mt-4" required v-model="hospitalization.complaints">
                        <option value="" selected>Escolher Queixas</option>
                        <option v-for="complaint in COMPLAINTS" :value="complaint">
                            {{ complaint }}
                        </option>
                    </select>
                </div>
                <div>
                    <select
                        class="form-control mt-4"
                        required
                        v-model="hospitalization.diagnostics"
                    >
                        <option value="" selected>Escolher Diagnosticos</option>
                        <option v-for="diagnosis in DIAGNOSTICS" :value="diagnosis">
                            {{ diagnosis }}
                        </option>
                    </select>
                </div>
                <div class="flex space-x-4">
                    <InputField
                        title="Data de entrada"
                        type="date"
                        class="flex-1 text-gray-500"
                        v-model="hospitalization.entryDate"
                        :is-required="true"
                    />
                    <InputField
                        title="Previsão de Alta Médica"
                        type="date"
                        class="flex-1 text-gray-500"
                        v-model="hospitalization.dischargeDate"
                        :is-required="true"
                    />
                </div>
            </section>
            <section class="container rounded mb-4">
                <h1 class="font-medium text-base">Orçamento</h1>
                <p class="text-sm text-gray-500">
                    Preencha os campos abaixo com os dados do orçamento.
                </p>
                <div class="flex items-end space-x-4">
                    <InputField
                        title="Inicia em"
                        type="date"
                        class="flex-1 text-gray-500"
                        v-model="budget.startDate"
                        :is-required="true"
                    />
                    <InputField
                        title="Termina em"
                        type="date"
                        class="flex-1 text-gray-500"
                        v-model="budget.endDate"
                        :is-required="true"
                    />
                </div>
                <div class="flex space-x-4">
                    <div class="flex-1 mt-2">
                        <select class="form-control" required v-model="budget.status">
                            <option value="" selected>Escolher Estado</option>
                            <option value="UNPAIND">Não Pago</option>
                            <option value="PENDING">Pendente</option>
                            <option value="PAID">Pago</option>
                        </select>
                    </div>
                    <div class="flex-1"></div>
                </div>
            </section>
        </section>
    </main>
    <Footer>
        <button class="btn btn-success space-x-3" @click="hospitalize()">
            <i class="bi bi-floppy2"></i>
            <span class="font-medium">{{ status }}</span>
        </button>
    </Footer>
</template>
