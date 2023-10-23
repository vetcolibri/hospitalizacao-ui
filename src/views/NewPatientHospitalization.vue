<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GoBack from '@/components/GoBack.vue'
import InputField from '@/components/hospitalization/InputField.vue'
import { COMPLAINTS, DIAGNOSIS } from '@/lib/data/hospitalization'
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
                            :is-required="true"
                        />
                        <div class="flex-1">
                            <label class="md:text-sm">Espécie</label>
                            <select class="form-select form-control" required>
                                <option value selected>Escolher espécie</option>
                                <option value="canino">CANINO</option>
                                <option value="felino">FELINO</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex space-x-4">
                        <InputField
                            title="Raça"
                            class="flex-1"
                            placeholder="Raça"
                            :is-required="true"
                        />
                        <InputField
                            title="ID Proprietário"
                            class="flex-1"
                            placeholder="ID Próprietário"
                            :is-required="true"
                        />
                    </div>
                    <div class="flex space-x-4">
                        <InputField
                            title="Nome do Proprietário"
                            class="flex-1"
                            placeholder="Nome do Proprietário"
                            :is-required="true"
                        />
                        <InputField
                            title="Telemóvel"
                            class="flex-1"
                            placeholder="Telemóvel"
                            :is-required="true"
                        />
                    </div>
                    <div class="flex space-x-4">
                        <InputField
                            title="Idade"
                            type="number"
                            class="flex-1"
                            placeholder="Idade"
                            :is-required="true"
                        />
                        <InputField
                            title="Peso Kg"
                            type="number"
                            class="flex-1"
                            placeholder="Peso Kg"
                            :is-required="true"
                        />
                    </div>
                    <div>
                        <label class="md:text-sm">Queixas</label>
                        <select class="form-select form-control mt-2" required>
                            <option value="" selected>Escolher queixas</option>
                            <option v-for="complaint in COMPLAINTS" :value="complaint">
                                {{ complaint }}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="md:text-sm">Diagnosticos</label>
                        <select class="form-select form-control mt-2" required>
                            <option value="" selected>Escolher diagnosticos</option>
                            <option v-for="diagnosis in DIAGNOSIS" :value="diagnosis">
                                {{ diagnosis }}
                            </option>
                        </select>
                    </div>
                    <InputField title="Data de entrada" type="date" :is-required="true" />
                    <InputField title="Data prevista de Alta" type="date" :is-required="true" />
                    <InputField title="Orçamento previsto até" type="date" :is-required="true" />
                </form>
            </section>
        </section>
    </main>
    <Footer>
        <button class="btn btn-success">Hospitalizar</button>
    </Footer>
</template>
