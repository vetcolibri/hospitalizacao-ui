<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'

import { iconUrl } from '@/lib/data/patients'
import { inject, onMounted, ref } from 'vue'
import { Provided } from '@/lib/provided'
import type { IPatientService } from '@/services/patient_service'
import type { PatientWithOwner } from '@/models/patient'
import type { Budget, Hospitalization } from '@/models/hospitalization'
import { BudgetStatus } from '@/models/hospitalization'
import { COMPLAINTS } from '@/lib/data/complaints'
import { DIAGNOSTICS } from '@/lib/data/diagnostics'
import { useRouter } from 'vue-router'

const patient = ref<PatientWithOwner>()
const message = ref<string>('')
const query = ref<string>('')
const status = ref<string>('Hospitalizar')
const patients = ref<PatientWithOwner[]>([])
const results = ref<PatientWithOwner[]>([])
const form = ref<HTMLFormElement>()
const router = useRouter()
const patientService = <IPatientService>inject(Provided.PATIENT_SERVICE)!

const hospitalization = ref<Hospitalization>({
    weight: 0,
    diagnostics: [],
    complaints: [],
    entryDate: '',
    dischargeDate: ''
})

const budget = ref<Budget>({
    startOn: '',
    endOn: '',
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
        hospitalization.value,
        budget.value
    )

    if (voidOrError.isLeft()) {
        console.error(voidOrError.value.message)
        status.value = 'Hospitalizar'
        return
    }

    alert('Paciente hospitalizado com sucesso.')
    router.push({ name: 'Dashboard' })
}

onMounted(async () => {
    const patientsOrError = await patientService.nonHospitalized()
    patients.value = <PatientWithOwner[]>patientsOrError.value
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
                    <BaseInput
                        title="Nome do Paciente"
                        class="flex-1 text-gray-500"
                        :placeholder="patient?.name"
                        :disabled="true"
                        :readonly="true"
                    />
                    <div class="flex space-x-4">
                        <BaseInput
                            title="ID Paciente"
                            class="flex-1 text-gray-500"
                            :placeholder="patient?.patientId"
                            :disabled="true"
                            :readonly="true"
                        />
                        <BaseInput
                            title="Espécie"
                            class="flex-1 text-gray-500"
                            :placeholder="patient?.specie"
                            :disabled="true"
                            :readonly="true"
                            :is-select="true"
                        />
                    </div>
                    <div class="flex space-x-4">
                        <BaseInput
                            title="Raça"
                            class="flex-1 text-gray-500"
                            :placeholder="patient?.breed"
                            :disabled="true"
                            :readonly="true"
                            :is-select="true"
                        />
                        <BaseInput
                            title="ID Proprietário"
                            class="flex-1 text-gray-500"
                            :placeholder="patient?.ownerId"
                            :disabled="true"
                            :readonly="true"
                        />
                    </div>
                    <div class="flex space-x-4">
                        <BaseInput
                            title="Nome do Proprietário"
                            class="flex-1 text-gray-500"
                            :placeholder="patient?.name"
                            :disabled="true"
                            :readonly="true"
                        />
                        <BaseInput
                            title="Telemóvel"
                            class="flex-1 text-gray-500"
                            :placeholder="patient?.ownerPhoneNumber"
                            :disabled="true"
                            :readonly="true"
                        />
                    </div>
                </section>
                <section class="container rounded mb-4">
                    <h1 class="font-medium">Hospitalização</h1>
                    <p class="text-sm text-gray-500">
                        Preencha os campos abaixo com os dados da hospitalização.
                    </p>
                    <BaseInput
                        type="number"
                        class="flex-1 text-gray-500"
                        placeholder="Peso Kg"
                        v-model="hospitalization.weight"
                        :is-required="true"
                        :max="100"
                        :min="1"
                    />
                    <BaseSelect
                        title="Escolher Queixas"
                        v-model="hospitalization.complaints"
                        :options="COMPLAINTS"
                        :limit="10"
                    />
                    <BaseSelect
                        title="Escolher Diagnosticos"
                        v-model="hospitalization.diagnostics"
                        :options="DIAGNOSTICS"
                        :limit="5"
                    />
                    <div class="flex space-x-4">
                        <BaseInput
                            title="Data de entrada"
                            type="date"
                            class="flex-1 text-gray-500"
                            v-model="hospitalization.entryDate"
                            :is-required="true"
                        />
                        <BaseInput
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
                        <BaseInput
                            title="Inicia em"
                            type="date"
                            class="flex-1 text-gray-500"
                            v-model="budget.startOn"
                            :is-required="true"
                        />
                        <BaseInput
                            title="Termina em"
                            type="date"
                            class="flex-1 text-gray-500"
                            v-model="budget.endOn"
                            :is-required="true"
                        />
                    </div>
                    <div class="flex space-x-4">
                        <div class="flex-1 mt-2">
                            <select class="form-control" required v-model="budget.status">
                                <option value="" selected>Escolher Estado</option>
                                <option :value="BudgetStatus.UNPAID">Não Pago</option>
                                <option :value="BudgetStatus.PENDING">Pendente</option>
                                <option :value="BudgetStatus.PAID">Pago</option>
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
