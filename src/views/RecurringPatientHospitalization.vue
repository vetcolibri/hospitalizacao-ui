<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import InputField from '@/components/hospitalization/InputField.vue'

import { iconUrl } from '@/lib/data/patients'
import { inject, onMounted, reactive, ref } from 'vue'
import { Provided } from '@/lib/provided'
import type { PatientService } from '@/services/patient_service'
import type { Patient } from '@/models/patient'
import type { Budget, Hospitalization } from '@/models/hospitalization'
import { COMPLAINTS } from '@/lib/data/complaints'
import { DIAGNOSTICS } from '@/lib/data/diagnostics'
import { useRouter } from 'vue-router'

const patientService = <PatientService>inject(Provided.PATIENT_SERVICE)!
const patient = ref<Patient>()
const message = ref<string>('')
const query = ref<string>('')
const status = ref<string>('Hospitalizar')
const patients = ref<Patient[]>([])
const results = ref<Patient[]>([])
const form = ref<HTMLFormElement>()
const router = useRouter()

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

function isEmpty() {
    return !patient.value
}

function showMessage(text: string) {
    message.value = text
}

function searchPatient() {
    if (query.value.length === 0) {
        showMessage('')
        clearResults()
        return
    }

    if (query.value.length < 3) {
        clearResults()
        showMessage('A pesquisa deve ter no mínimo 3 caracteres.')
        return
    }

    const patientsFound = patients.value.filter(
        (patient) =>
            patient.name.toLowerCase().includes(query.value.toLowerCase()) ||
            patient.patientId.toLowerCase().includes(query.value.toLowerCase()) ||
            patient.ownerName!.toLowerCase().includes(query.value.toLowerCase())
    )

    if (patientsFound.length === 0) {
        clearResults()
        showMessage('Nenhum paciente encontrado.')
        return
    }
    results.value = patientsFound
}

function clearResults() {
    results.value = []
}

async function hospitalize() {
    if (!form.value?.checkValidity()) return form.value?.reportValidity()
    status.value = 'A hospitalizar...'
    const voidOrError = await patientService.newHospitalization(
        patient.value!.patientId,
        hospitalization.value
    )

    if (voidOrError.isLeft()) {
        alert(voidOrError.value.message)
        status.value = 'Hospitalizar'
        return
    }

    alert('Paciente hospitalizado com sucesso.')
    router.push({ name: 'Dashboard' })
}

onMounted(async () => {
    const patientsOrError = await patientService.nonHospitalized()
    patients.value = patientsOrError.value as Patient[]
})
</script>
<template>
    <Header title="Nova Hospitalização">
        <GoBack />
    </Header>
    <main v-if="isEmpty()" class="main-content px-12">
        <section class="container my-8">
            <h1 class="font-medium text-xs md:text-base">Pesquiar paciente</h1>
            <p class="text-gray-500 text-xs sm:text-sm">
                Encontre aqui um paciente para ser hospitalizado.
            </p>
            <div class="flex items-center gap-1 px-3 rounded shadow-sm border border-gray-300">
                <i class="bi bi-search text-base md:text-xl text-yellow-500"></i>
                <input
                    class="w-full text-sm p-2.5 border-0 focus:border-gray-300 focus:ring-0"
                    type="text"
                    placeholder="Digite o ID, Nome ou Nome do Proprietário"
                    v-model="query"
                    @input="searchPatient()"
                />
            </div>
            <p class="text-xs text-red-500">{{ message }}</p>
            <div v-if="results.length">
                <div
                    v-for="item in results"
                    @click="() => (patient = item)"
                    class="flex items-center gap-4 border-b p-2 cursor-pointer hover:bg-gray-100"
                >
                    <img :src="iconUrl" alt="patient-image" width="40" />
                    <span>{{ item.name }}</span>
                </div>
            </div>
        </section>
    </main>
    <main v-else class="main-content">
        <section class="px-12 my-8">
            <form ref="form">
                <section class="container rounded mt-8 mb-4">
                    <h1 class="font-medium">Paciente</h1>
                    <p class="text-sm text-gray-500">Dados do paciente.</p>
                    <InputField
                        title="Nome do Paciente"
                        :placeholder="patient?.name"
                        :disabled="true"
                        :readonly="true"
                        class="flex-1 text-gray-500"
                    />
                    <div class="flex space-x-4">
                        <InputField
                            title="ID Paciente"
                            :placeholder="patient?.patientId"
                            :disabled="true"
                            :readonly="true"
                            class="flex-1 text-gray-500"
                        />
                        <InputField
                            title="Espécie"
                            :placeholder="patient?.specie"
                            :disabled="true"
                            :readonly="true"
                            :is-select="true"
                            class="flex-1 text-gray-500"
                        />
                    </div>
                    <div class="flex space-x-4">
                        <InputField
                            title="Raça"
                            :placeholder="patient?.breed"
                            :disabled="true"
                            :readonly="true"
                            :is-select="true"
                            class="flex-1 text-gray-500"
                        />
                        <InputField
                            title="ID Proprietário"
                            :placeholder="patient?.ownerId"
                            :disabled="true"
                            :readonly="true"
                            class="flex-1 text-gray-500"
                        />
                    </div>
                    <div class="flex space-x-4">
                        <InputField
                            title="Nome do Proprietário"
                            :placeholder="patient?.ownerName"
                            :disabled="true"
                            :readonly="true"
                            class="flex-1 text-gray-500"
                        />
                        <InputField
                            title="Telemóvel"
                            :placeholder="patient?.ownerPhoneNumber"
                            :disabled="true"
                            :readonly="true"
                            class="flex-1 text-gray-500"
                        />
                    </div>
                </section>
                <section class="container rounded mb-4">
                    <h1 class="font-medium">Hospitalização</h1>
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
                        <select
                            class="form-control mt-4"
                            required
                            v-model="hospitalization.complaints"
                        >
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
            </form>
        </section>
    </main>
    <Footer>
        <button
            v-show="patient?.patientId"
            class="btn btn-success space-x-3"
            @click="hospitalize()"
        >
            <i class="bi bi-floppy2"></i>
            <span class="font-medium">{{ status }}</span>
        </button>
    </Footer>
</template>
