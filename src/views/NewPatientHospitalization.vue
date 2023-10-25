<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import InputField from '@/components/hospitalization/InputField.vue'
import { ref } from 'vue'
import type { Hospitalization } from '@/models/hospitalization'
import { COMPLAINTS, DIAGNOSIS, BREEDS } from '@/lib/data/hospitalization'

const newHospitalization = ref<Hospitalization>({
    name: '',
    specie: '',
    breed: '',
    ownerId: '',
    ownerName: '',
    ownerPhoneNumber: '',
    age: 0,
    weight: 0,
    diagnostics: '',
    complaints: '',
    entryDate: '',
    dischargeDate: '',
    estimatedBudgetDate: ''
})
</script>

<template>
    <Header title="Nova hospitalização">
        <GoBack />
    </Header>
    <main class="main-content">
        <section class="px-12">
            <section class="container my-8">
                <form ref="form" class="space-y-3">
                    <div class="flex items-center space-x-4">
                        <InputField
                            title="Nome do Paciente"
                            class="flex-1"
                            placeholder="Nome do Paciente"
                            v-model="newHospitalization.name"
                            :is-required="true"
                        />
                        <div class="flex-1">
                            <label class="md:text-sm">Espécie</label>
                            <select
                                class="form-select form-control"
                                required
                                v-model="newHospitalization.specie"
                            >
                                <option value="" selected>Escolher espécie</option>
                                <option value="canino">CANINO</option>
                                <option value="felino">FELINO</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex space-x-4">
                        <div class="flex-1">
                            <label class="md:text-sm">Espécie</label>
                            <select
                                class="form-select form-control"
                                required
                                v-model="newHospitalization.breed"
                            >
                                <option value="" selected>Escolher raça</option>
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
                            title="ID Proprietário"
                            class="flex-1"
                            placeholder="ID Próprietário"
                            v-model="newHospitalization.ownerId"
                            :is-required="true"
                        />
                    </div>
                    <div class="flex space-x-4">
                        <InputField
                            title="Nome do Proprietário"
                            class="flex-1"
                            placeholder="Nome do Proprietário"
                            v-model="newHospitalization.ownerName"
                            :is-required="true"
                        />
                        <InputField
                            title="Telemóvel"
                            class="flex-1"
                            placeholder="Telemóvel"
                            v-model="newHospitalization.ownerPhoneNumber"
                            :is-required="true"
                        />
                    </div>
                    <div class="flex space-x-4">
                        <InputField
                            title="Idade"
                            type="number"
                            class="flex-1"
                            placeholder="Idade"
                            v-model="newHospitalization.age"
                            :is-required="true"
                        />
                        <InputField
                            title="Peso Kg"
                            type="number"
                            class="flex-1"
                            placeholder="Peso Kg"
                            v-model="newHospitalization.weight"
                            :is-required="true"
                        />
                    </div>
                    <div>
                        <label class="md:text-sm">Queixas</label>
                        <select
                            class="form-select form-control mt-2"
                            required
                            v-model="newHospitalization.complaints"
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
                            required
                            v-model="newHospitalization.diagnostics"
                        >
                            <option value="" selected>Escolher diagnosticos</option>
                            <option v-for="diagnosis in DIAGNOSIS" :value="diagnosis">
                                {{ diagnosis }}
                            </option>
                        </select>
                    </div>
                    <InputField
                        title="Data de entrada"
                        type="date"
                        v-model="newHospitalization.entryDate"
                        :is-required="true"
                    />
                    <InputField
                        title="Data prevista de Alta"
                        type="date"
                        v-model="newHospitalization.dischargeDate"
                        :is-required="true"
                    />
                    <InputField
                        title="Orçamento previsto até"
                        type="date"
                        v-model="newHospitalization.estimatedBudgetDate"
                        :is-required="true"
                    />
                </form>
            </section>
        </section>
    </main>
    <Footer>
        <button class="btn btn-success space-x-3">
            <i class="bi bi-floppy2"></i>
            <span class="font-semibold"> Hospitalizar</span>
        </button>
    </Footer>
</template>
