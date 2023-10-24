<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Search from '@/components/hospitalization/InputField.vue'
import GoBack from '@/components/GoBack.vue'

import { inject, ref } from 'vue'
import { Provided } from '@/lib/provided'
import type { PatientService } from '@/services/patient_service'
import type { Patient } from '@/models/patient'
import type { Hospitalization } from '@/models/hospitalization'
import { COMPLAINTS, DIAGNOSIS } from '@/lib/data/hospitalization'

const patientService = <PatientService>inject(Provided.PATIENT_SERVICE)!
const patient = ref<Patient>()
const message = ref<string>('')
const patientId = ref<string>('')

const newHospitalization = ref<Hospitalization>({
    age: 0,
    weight: 0,
    diagnostics: '',
    complaints: '',
    entryDate: '',
    dischargeDate: '',
    estimatedBudgetDate: ''
})

function isEmpty() {
    return !patient.value
}

function showMessage(text: string) {
    message.value = text
}

async function findPatient() {
    if (patientId.value === '') {
        showMessage('Preencha o campo de busca.')
        return
    }
    const patientOrError = await patientService.findPatientById(patientId.value)
    if (patientOrError.isLeft() && patientOrError.value.status === 404) {
        showMessage(`Paciente com ID ${patientId.value} não foi encontrado.`)
        return
    }
    patient.value = <Patient>patientOrError.value
}
</script>
<template>
    <Header title="Nova Hospitalização">
        <GoBack />
    </Header>
    <main v-if="isEmpty()" class="main-content flex flex-col justify-center px-12">
        <section class="container">
            <p class="text-gray-600">
                Encontre o <strong>Paciente</strong> pelo seu ID para ser hospitalizado.
            </p>
            <div class="flex items-center gap-3">
                <Search
                    placeholder="Digite o ID do Paciente"
                    class="w-full mt-0"
                    v-model="patientId"
                />
                <button type="button" @click="findPatient()">
                    <i class="bi bi-search text-base md:text-2xl text-yellow-500"></i>
                </button>
            </div>
            <p class="text-xs text-red-500">{{ message }}</p>
        </section>
    </main>
    <main v-else class="main-content">
        <section class="px-12 my-8">
            <section class="container">
                <form ref="form" class="space-y-3">
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
            </section>
        </section>
    </main>
    <Footer>
        <button v-show="patient?.patientId" class="btn btn-success">Hospitalizar</button>
    </Footer>
</template>
