<script lang="ts" setup>
import Header from '@/components/Header.vue'
import GoBack from '@/components/GoBack.vue'
import Footer from '@/components/Footer.vue'
import InputField from '@/components/hospitalization/InputField.vue'
import { QUEIXAS, DIAGNOSTICOS } from '@/lib/data/hospitalization'
import { ref } from 'vue'

const form = ref<HTMLFormElement>()
const patientID = ref<string>('')

function hospitalize() {
    console.log(patientID.value)
    const isValid = form.value?.checkValidity()
    if (!isValid) return form.value?.reportValidity()
}
</script>
<template>
    <Header title="Nova Hospitalização">
        <GoBack></GoBack>
    </Header>
    <main class="main-content py-8">
        <section class="container">
            <form ref="form" class="space-y-3">
                <InputField
                    title="ID Paciente"
                    value="019298921"
                    :disabled="true"
                    :readonly="true"
                ></InputField>

                <div class="flex space-x-4">
                    <InputField
                        title="Nome do Paciente"
                        value="Rex"
                        :disabled="true"
                        :readonly="true"
                        class="flex-1"
                    />
                    <InputField
                        title="Espécie"
                        value="CANINO"
                        :disabled="true"
                        :readonly="true"
                        :is-select="true"
                        class="flex-1"
                    />
                </div>
                <div class="flex space-x-4">
                    <InputField
                        title="Raça"
                        value="Bulldog"
                        :disabled="true"
                        :readonly="true"
                        :is-select="true"
                        class="flex-1"
                    />
                    <InputField
                        title="ID Proprietário"
                        value="PR - 2921/KJ23"
                        :disabled="true"
                        :readonly="true"
                        class="flex-1"
                    />
                </div>

                <div class="flex space-x-4">
                    <InputField
                        title="Nome do Proprietário"
                        value="João Santos"
                        :disabled="true"
                        :readonly="true"
                        class="flex-1"
                    />
                    <InputField
                        title="Telemóvel"
                        value="933843893"
                        :disabled="true"
                        :readonly="true"
                        class="flex-1"
                    />
                </div>

                <div class="flex space-x-4">
                    <InputField title="Idade" type="number" :is-required="true" class="flex-1" />
                    <InputField title="Peso Kg" type="number" :is-required="true" class="flex-1" />
                </div>

                <div>
                    <label class="md:text-sm">Queixas</label>
                    <select class="form-select form-control mt-2" required>
                        <option value="">Escolher queixas</option>
                        <option v-for="queixa in QUEIXAS" :value="queixa">{{ queixa }}</option>
                    </select>
                </div>

                <div>
                    <label class="md:text-sm">Diagnosticos</label>
                    <select class="form-select form-control mt-2" required>
                        <option value="">Escolher diagnosticos</option>
                        <option v-for="diagnostico in DIAGNOSTICOS" :value="diagnostico">
                            {{ diagnostico }}
                        </option>
                    </select>
                </div>

                <InputField title="Data de entrada" type="date" :is-required="true" />
                <InputField title="Data prevista de Alta" type="date" :is-required="true" />
                <InputField title="Orçamento previsto até" type="date" :is-required="true" />
            </form>
        </section>
    </main>
    <Footer>
        <button type="button" class="btn-success" @click="hospitalize()">Hospitalizar</button>
    </Footer>
</template>
