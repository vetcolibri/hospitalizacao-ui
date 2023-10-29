<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import InputField from '@/components/hospitalization/InputField.vue'

import { inject, onMounted, ref } from 'vue'
import { Provided } from '@/lib/provided'
import type { PatientService } from '@/services/patient_service'
import type { Patient } from '@/models/patient'
import type { Hospitalization } from '@/models/hospitalization'
import { COMPLAINTS, DIAGNOSIS } from '@/lib/data/hospitalization'
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
        newHospitalization.value
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
            <table v-if="results.length > 0" class="w-full text-sm text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" class="px-6 py-3">ID Paciente</th>
                        <th scope="col" class="px-6 py-3">Nome</th>
                        <th scope="col" class="px-6 py-3">Espécie</th>
                        <th scope="col" class="px-6 py-3">Raça</th>
                        <th scope="col" class="px-6 py-3">Telemóvel</th>
                    </tr>
                </thead>
                <tbody class="bg-white border-b hover:bg-gray-50">
                    <tr
                        v-for="item in results"
                        :key="item.patientId"
                        class="cursor-pointer"
                        @click="() => (patient = item)"
                    >
                        <td class="px-6 py-4">{{ item.patientId }}</td>
                        <td class="px-6 py-4">{{ item.name }}</td>
                        <td class="px-6 py-4">{{ item.specie }}</td>
                        <td class="px-6 py-4">{{ item.breed }}</td>
                        <td class="px-6 py-4">{{ item.ownerPhoneNumber }}</td>
                    </tr>
                </tbody>
            </table>
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
                            :placeholder="patient?.breed"
                            :disabled="true"
                            :readonly="true"
                            :is-select="true"
                            class="flex-1"
                        />
                        <InputField
                            title="ID Proprietário"
                            :placeholder="patient?.ownerId"
                            :disabled="true"
                            :readonly="true"
                            class="flex-1"
                        />
                    </div>
                    <div class="flex space-x-4">
                        <InputField
                            title="Nome do Proprietário"
                            :placeholder="patient?.ownerName"
                            :disabled="true"
                            :readonly="true"
                            class="flex-1"
                        />
                        <InputField
                            title="Telemóvel"
                            :placeholder="patient?.ownerPhoneNumber"
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
                            placeholder="Idade do paciente"
                            v-model="newHospitalization!.age"
                            :is-required="true"
                            :min="1"
                            :max="20"
                        />
                        <InputField
                            title="Peso Kg"
                            type="number"
                            class="flex-1"
                            placeholder="Peso do paciente (Kg)"
                            v-model="newHospitalization!.weight"
                            :is-required="true"
                            :min="1"
                            :max="100"
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
