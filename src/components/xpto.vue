<script lang="ts" setup>
import Header from '@/components/Header.vue'
import GoBack from '@/components/GoBack.vue'
import Footer from '@/components/Footer.vue'
import InputField from '@/components/hospitalization/InputField.vue'
import Notification from '@/components/Notification.vue'

import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Provided } from '@/lib/provided'
import type { PatientService } from '@/services/patient_service'
import type { Hospitalization } from '@/models/hospitalization'
import { COMPLAINTS, DIAGNOSIS } from '@/lib/data/hospitalization'
import { useNotificationStore } from '@/store/notificationStore'

const newHospitalization = ref<Hospitalization>({
    age: 0,
    weight: 0,
    diagnostics: '',
    complaints: '',
    entryDate: '',
    dischargeDate: '',
    estimatedBudgetDate: ''
})

const router = useRouter()
const form = ref<HTMLFormElement>()
const service = inject<PatientService>(Provided.PATIENT_SERVICE)!
const notificationStore = useNotificationStore()

async function hospitalize() {
    const isValid = form.value?.checkValidity()
    if (!isValid) return form.value?.reportValidity()
    const resultOrErr = await service.newHospitalization(
        'some-patient-id',
        newHospitalization.value
    )
    if (resultOrErr.isLeft()) {
        console.log(resultOrErr.value.message)
        notificationStore.notify(resultOrErr.value.message, 'warning')
        return
    }
    notificationStore.notify('Hospitalização criada com sucesso!', 'success')
    router.push({ name: 'ExamGeneralCondition' })
}
</script>
<template>
    <Header title="Nova Hospitalização">
        <GoBack></GoBack>
    </Header>
    <main class="main-content">
        <Notification />
        <section class="px-12">
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
                        <InputField
                            title="Idade"
                            type="number"
                            class="flex-1"
                            v-model="newHospitalization!.age"
                            :is-required="true"
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
        <button class="btn-success" @click="hospitalize()">Hospitalizar</button>
    </Footer>
</template>
