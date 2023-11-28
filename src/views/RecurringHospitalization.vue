<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import Message from '@/components/Message.vue'

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
const query = ref<string>('')
const messageRef = ref<typeof Message>()
const mainRef = ref<HTMLElement>()
const status = ref<string>('Hospitalizar')
const patients = ref<PatientWithOwner[]>([])
const results = ref<PatientWithOwner[]>([])
const searchMessage = ref<string>('')
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
    searchMessage.value = text
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

    showMessage('')
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
        status.value = 'Hospitalizar'
        messageRef.value?.add(voidOrError.value.message)
        mainRef.value?.scrollTo({ top: 0 })
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
    <main v-if="isEmpty()" class="main-content">
        <section class="container my-8">
            <h1 class="font-medium">Pesquisar paciente</h1>
            <p class="text-sm text-gray-500">
                Pesquise pelo ID, Nome do paciente ou do Proprietário.
            </p>
            <div class="flex items-center px-2 rounded shadow-sm border border-gray-300">
                <i class="bi bi-search icon"></i>
                <input
                    class="w-full md:p-2.5 border-0 focus:border-gray-300 focus:ring-0"
                    type="text"
                    placeholder="Pesquisar paciente..."
                    v-model="query"
                    @input="searchPatient()"
                />
            </div>
            <p class="text-sm text-red-500">{{ searchMessage }}</p>
            <div v-if="results.length">
                <div
                    v-for="item in results"
                    @click="() => (patient = item)"
                    class="flex items-center gap-4 border-b p-2 cursor-pointer hover:bg-gray-100"
                >
                    <img :src="iconUrl" class="w-[20px] sm:w-[30px]" alt="patient-image" />
                    <span class="font-medium text-gray-700">
                        {{ item.name }}
                    </span>
                </div>
            </div>
        </section>
    </main>
    <main ref="mainRef" v-else class="main-content">
        <form ref="form">
            <Message ref="messageRef" />
            <section class="container rounded my-4">
                <h1 class="font-medium">Paciente</h1>
                <p class="text-sm text-gray-500">Dados do paciente.</p>
                <BaseInput
                    title="Nome do Paciente"
                    class="flex-1 text-gray-500"
                    :placeholder="patient?.name"
                    :disabled="true"
                    :readonly="true"
                />
                <div class="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
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
                <div class="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
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
                <div class="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
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
                <p class="text-sm text-gray-500 leading-5">
                    Preencha os campos abaixo com os dados da hospitalização.
                </p>
                <div class="flex flex-col space-y-4">
                    <BaseInput
                        type="number"
                        class="text-gray-500"
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
                </div>
                <div class="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
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
                <h1 class="font-medium">Orçamento</h1>
                <p class="text-sm text-gray-500 leading-5">
                    Preencha os campos abaixo com os dados do orçamento.
                </p>
                <div class="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
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
                <div class="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <div class="flex-1 mt-2">
                        <select class="form-control" required v-model="budget.status">
                            <option value="" selected>Escolher Estado</option>
                            <option :value="BudgetStatus.UNPAID">Não Pago</option>
                            <option :value="BudgetStatus.PENDING">Pendente</option>
                            <option :value="BudgetStatus.PENDING_WITH_BUDGET_SENT">
                                Pendente (Orçamento enviado)
                            </option>
                            <option :value="BudgetStatus.PAID">Pago</option>
                        </select>
                    </div>
                    <div class="flex-1"></div>
                </div>
            </section>
        </form>
    </main>
    <Footer>
        <button
            v-show="patient?.patientId"
            class="btn btn-success space-x-2"
            @click="hospitalize()"
        >
            <i class="bi bi-floppy2"></i>
            <span class="font-medium">{{ status }}</span>
        </button>
    </Footer>
</template>
