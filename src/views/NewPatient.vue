<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import Message from '@/components/Message.vue'
import ChooseBreed from '@/components/ChooseBreed.vue'

import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Provided } from '@/lib/provided'
import { COMPLAINTS } from '@/lib/data/complaints'
import { DIAGNOSTICS } from '@/lib/data/diagnostics'
import { BudgetStatus } from '@/lib/models/hospitalization'
import type { IPatientService, NewPatientData } from '@/lib/services/patient_service'

const form = ref<HTMLFormElement>()
const buttonLabel = ref<string>('Hospitalizar')
const mainRef = ref<HTMLElement>()
const messageRef = ref<typeof Message>()
const router = useRouter()
const patientService = <IPatientService>inject(Provided.PatientService)!
const ownerExists = ref<boolean>(false)

const newPatientData = ref<NewPatientData>({
    patientData: {
        patientId: '',
        name: '',
        specie: '',
        breed: '',
        birthDate: ''
    },
    ownerData: {
        ownerId: '',
        name: '',
        phoneNumber: ''
    },
    hospitalizationData: {
        weight: 0,
        complaints: [],
        diagnostics: [],
        entryDate: '',
        dischargeDate: ''
    },
    budgetData: {
        startOn: '',
        endOn: '',
        status: ''
    }
})

async function findOwner() {
    const ownerId = newPatientData.value.ownerData.ownerId
    if (!ownerId) {
        clearOwnerData()
        return
    }

    const ownerOrErr = await patientService.findOwner(ownerId)
    if (ownerOrErr.isLeft()) {
        clearOwnerData()
        return
    }

    ownerExists.value = true
    newPatientData.value.ownerData = ownerOrErr.value
}

function clearOwnerData() {
    ownerExists.value = false
    newPatientData.value.ownerData = {
        ...newPatientData.value.ownerData,
        name: '',
        phoneNumber: ''
    }
}

function clearSelectedBreed() {
    newPatientData.value.patientData.breed = ''
}

async function hospitalize() {
    if (!form.value?.checkValidity()) return form.value?.reportValidity()

    buttonLabel.value = 'A hospitalizar...'
    const voidOrErr = await patientService.newPatient(newPatientData.value)
    if (voidOrErr.isLeft()) {
        buttonLabel.value = 'Hospitalizar'
        messageRef.value?.add(voidOrErr.value.message)
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
                    v-model="newPatientData.patientData.name"
                    :is-required="true"
                />
                <div class="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <BaseInput
                        class="flex-1"
                        placeholder="ID do Paciente"
                        v-model="newPatientData.patientData.patientId"
                        :is-required="true"
                    />
                    <div class="flex-1">
                        <select
                            class="form-control"
                            required
                            v-model="newPatientData.patientData.specie"
                            @change="clearSelectedBreed()"
                        >
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
                    <ChooseBreed
                        class="flex-1"
                        title="Escolher Raça"
                        :specie="newPatientData!.patientData.specie"
                        :limit="1"
                        :disabled="!newPatientData.patientData.specie"
                        @update:model-value="newPatientData!.patientData.breed = $event"
                    />
                    <BaseInput
                        class="flex-1"
                        placeholder="ID Próprietário"
                        v-model="newPatientData.ownerData.ownerId"
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
                        v-model="newPatientData.ownerData.name"
                        :is-required="true"
                    />
                    <BaseInput
                        class="flex-1"
                        placeholder="Telemóvel"
                        v-model="newPatientData.ownerData.phoneNumber"
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
                        :placeholder="newPatientData.ownerData.name"
                        :disabled="true"
                        :readonly="true"
                    />
                    <BaseInput
                        class="flex-1"
                        :placeholder="newPatientData.ownerData.phoneNumber"
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
                        v-model="newPatientData.patientData.birthDate"
                        :is-required="true"
                    />
                    <BaseInput
                        title="Peso Kg"
                        type="number"
                        class="flex-1"
                        placeholder="Peso Kg"
                        v-model="newPatientData.hospitalizationData.weight"
                        :is-required="true"
                        :max="100"
                        :min="1"
                        :step="0.01"
                    />
                </div>
                <BaseSelect
                    title="Escolher Queixas"
                    :options="COMPLAINTS"
                    :limit="10"
                    v-model="newPatientData.hospitalizationData.complaints"
                />
                <BaseSelect
                    title="Escolher Diagnosticos"
                    :options="DIAGNOSTICS"
                    :limit="5"
                    v-model="newPatientData.hospitalizationData.diagnostics"
                />
                <div class="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <BaseInput
                        title="Data de entrada"
                        type="date"
                        class="flex-1"
                        v-model="newPatientData.hospitalizationData.entryDate"
                        :is-required="true"
                    />
                    <BaseInput
                        title="Previsão de Alta Médica"
                        type="date"
                        class="flex-1"
                        v-model="newPatientData.hospitalizationData.dischargeDate"
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
                        v-model="newPatientData.budgetData.startOn"
                        :is-required="true"
                    />
                    <BaseInput
                        title="Termina em"
                        type="date"
                        class="flex-1"
                        v-model="newPatientData.budgetData.endOn"
                        :is-required="true"
                    />
                </div>
                <div class="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <div class="flex-1 mt-2">
                        <select
                            class="form-control"
                            required
                            v-model="newPatientData.budgetData.status"
                        >
                            <option value="" selected>Escolher Estado</option>
                            <option :value="BudgetStatus.Unpaid">Não Pago</option>
                            <option :value="BudgetStatus.Pending">Pendente</option>
                            <option :value="BudgetStatus.PendingWithBudgetSent">
                                Pendente (Orçamento enviado)
                            </option>
                            <option :value="BudgetStatus.Paid">Pago</option>
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
            <span class="font-medium">{{ buttonLabel }}</span>
        </button>
    </Footer>
</template>
