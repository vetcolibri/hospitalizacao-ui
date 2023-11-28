<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import Message from '@/components/Message.vue'

import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Provided } from '@/lib/provided'
import { COMPLAINTS } from '@/lib/data/complaints'
import { DIAGNOSTICS } from '@/lib/data/diagnostics'
import { BREEDS } from '@/lib/data/breeds'
import { BudgetStatus } from '@/models/hospitalization'
import type { Hospitalization, Budget } from '@/models/hospitalization'
import type { IPatientService } from '@/services/patient_service'
import type { Owner, Patient } from '@/models/patient'

const form = ref<HTMLFormElement>()
const status = ref<string>('Hospitalizar')
const mainRef = ref<HTMLElement>()
const messageRef = ref<typeof Message>()
const router = useRouter()
const patientService = <IPatientService>inject(Provided.PATIENT_SERVICE)!
const ownerExists = ref<boolean>(false)

const patientData = ref<Patient>({
    name: '',
    patientId: '',
    specie: '',
    breed: '',
    birthDate: ''
})

const ownerData = ref<Owner>({
    ownerId: '',
    name: '',
    phoneNumber: ''
})

const hospitalizationData = ref<Hospitalization>({
    weight: 0,
    complaints: [],
    diagnostics: [],
    entryDate: '',
    dischargeDate: ''
})

const budgetData = ref<Budget>({
    startOn: '',
    endOn: '',
    status: ''
})

async function findOwner() {
    if (!ownerData.value.ownerId) {
        clearOwnerData()
        return
    }

    const ownerOrError = await patientService.findOwner(ownerData.value.ownerId)

    if (ownerOrError.isLeft()) {
        clearOwnerData()
        return
    }

    ownerExists.value = true
    ownerData.value = ownerOrError.value
}

function clearOwnerData() {
    ownerExists.value = false
    ownerData.value = {
        ownerId: ownerData.value.ownerId,
        name: '',
        phoneNumber: ''
    }
}

async function hospitalize() {
    if (!form.value?.checkValidity()) return form.value?.reportValidity()

    status.value = 'A hospitalizar...'
    const voidOrError = await patientService.newPatient(
        patientData.value,
        ownerData.value,
        hospitalizationData.value,
        budgetData.value
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
</script>

<template>
    <Header title="Nova hospitalização">
        <GoBack />
    </Header>
    <main ref="mainRef" class="main-content text-gray-500">
        <form ref="form">
            <Message ref="messageRef" />
            <section class="container rounded my-4">
                <h1 class="font-medium">Paciente</h1>
                <p class="text-sm text-gray-500">
                    Preencha os campos abaixo com os dados do paciente.
                </p>
                <BaseInput
                    placeholder="Nome do Paciente"
                    v-model="patientData.name"
                    :is-required="true"
                />
                <div class="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <BaseInput
                        class="flex-1"
                        placeholder="ID do Paciente"
                        v-model="patientData.patientId"
                        :is-required="true"
                    />
                    <div class="flex-1">
                        <select class="form-control" required v-model="patientData.specie">
                            <option value="" selected>Escolher Espécie</option>
                            <option value="CANINO">CANINO</option>
                            <option value="FELINO">FELINO</option>
                            <option value="AVES">AVES</option>
                            <option value="EXOTICO">EXÓTICO</option>
                            <option value="EXOTICO - MACACO">EXÓTICO - MACACO</option>
                            <option value="EXOTICO - PAPAGAIO">EXÓTICO - PAPAGAIO</option>
                        </select>
                    </div>
                </div>
                <div class="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <div class="flex-1">
                        <select class="form-control" required v-model="patientData.breed">
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
                    <BaseInput
                        class="flex-1"
                        placeholder="ID Próprietário"
                        v-model="ownerData.ownerId"
                        :is-required="true"
                        @keyup="findOwner()"
                    />
                </div>
                <div
                    v-if="!ownerExists"
                    class="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0"
                >
                    <BaseInput
                        class="flex-1"
                        placeholder="Nome do Proprietário"
                        v-model="ownerData.name"
                        :is-required="true"
                    />
                    <BaseInput
                        class="flex-1"
                        placeholder="Telemóvel"
                        v-model="ownerData.phoneNumber"
                        :is-required="true"
                        pattern="^9[1-5]\d{7}$"
                        help-text="Por favor, insira um número de telefone válido para Angola."
                    />
                </div>
                <div
                    v-if="ownerExists"
                    class="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0"
                >
                    <BaseInput
                        class="flex-1"
                        :placeholder="ownerData.name"
                        :disabled="true"
                        :readonly="true"
                    />
                    <BaseInput
                        class="flex-1"
                        :placeholder="ownerData.phoneNumber"
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
                <div class="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <BaseInput
                        title="Data de nascimento"
                        type="date"
                        class="flex-1"
                        placeholder="Data de nascimento"
                        v-model="patientData.birthDate"
                        :is-required="true"
                    />
                    <BaseInput
                        title="Peso Kg"
                        type="number"
                        class="flex-1"
                        placeholder="Peso Kg"
                        v-model="hospitalizationData.weight"
                        :is-required="true"
                        :max="100"
                        :min="1"
                    />
                </div>
                <BaseSelect
                    title="Escolher Queixas"
                    :options="COMPLAINTS"
                    :limit="10"
                    v-model="hospitalizationData.complaints"
                />
                <BaseSelect
                    title="Escolher Diagnosticos"
                    :options="DIAGNOSTICS"
                    :limit="5"
                    v-model="hospitalizationData.diagnostics"
                />
                <div class="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <BaseInput
                        title="Data de entrada"
                        type="date"
                        class="flex-1"
                        v-model="hospitalizationData.entryDate"
                        :is-required="true"
                    />
                    <BaseInput
                        title="Previsão de Alta Médica"
                        type="date"
                        class="flex-1"
                        v-model="hospitalizationData.dischargeDate"
                        :is-required="true"
                    />
                </div>
            </section>
            <section class="container rounded mb-4">
                <h1 class="font-medium">Orçamento</h1>
                <p class="text-sm text-gray-500 leading-5">
                    Preencha os campos abaixo com os dados do orçamento.
                </p>
                <div class="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <BaseInput
                        title="Inicia em"
                        type="date"
                        class="flex-1"
                        v-model="budgetData.startOn"
                        :is-required="true"
                    />
                    <BaseInput
                        title="Termina em"
                        type="date"
                        class="flex-1"
                        v-model="budgetData.endOn"
                        :is-required="true"
                    />
                </div>
                <div class="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <div class="flex-1 mt-2">
                        <select class="form-control" required v-model="budgetData.status">
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
        <button class="btn btn-success space-x-2" @click="hospitalize()">
            <i class="bi bi-floppy2"></i>
            <span class="font-medium">{{ status }}</span>
        </button>
    </Footer>
</template>
