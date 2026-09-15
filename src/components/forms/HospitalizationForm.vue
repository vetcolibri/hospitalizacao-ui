<script setup lang="ts">
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'

import { COMPLAINTS } from '@/lib/data/complaints'
import { DIAGNOSTICS } from '@/lib/data/diagnostics'
import type { ContactModel } from '@/lib/models/contact'
import { ref } from 'vue'

interface Hospitalization {
    weight: number
    complaints: string[]
    diagnostics: string[]
    entryDate: string
    dischargeDate: string
    contact?: ContactModel
}

const complaintsRef = ref<typeof BaseSelect>()
const diagnosticsRef = ref<typeof BaseSelect>()

const hospitalization = ref<Hospitalization>({
    weight: 0,
    complaints: [],
    diagnostics: [],
    entryDate: '',
    dischargeDate: ''
})

// Excepção ao tutor principal (RF-13). Só é enviada quando está activa e é
// limpa ao desactivar, para nunca persistir valores escondidos.
const useSpecificContact = ref(false)
const contact = ref<ContactModel>({ name: '', phoneNumber: '', whatsapp: false })

const emits = defineEmits<{ (e: 'hospitalization', value: Hospitalization): void }>()

function emitHospitalization() {
    emits('hospitalization', {
        ...hospitalization.value,
        contact: useSpecificContact.value ? { ...contact.value } : undefined
    })
}

function toggleSpecificContact(event: Event) {
    useSpecificContact.value = (event.target as HTMLInputElement).checked

    if (!useSpecificContact.value) clearSpecificContact()

    emitHospitalization()
}

function toggleContactWhatsapp(event: Event) {
    contact.value.whatsapp = (event.target as HTMLInputElement).checked
    emitHospitalization()
}

function clearSpecificContact() {
    useSpecificContact.value = false
    contact.value = { name: '', phoneNumber: '', whatsapp: false }
}

function clear() {
    complaintsRef.value?.clear()
    diagnosticsRef.value?.clear()

    clearSpecificContact()
    emitHospitalization()
}

defineExpose({ clear })
</script>

<template>
    <section class="container rounded mb-4">
        <h1 class="font-medium">Hospitalização</h1>

        <p class="text-sm text-gray-500 leading-5">
            Preencha os campos abaixo com os dados da hospitalização.
        </p>

        <BaseInput
            type="number"
            placeholder="Peso Kg"
            data-field="hospitalizationData.weight"
            v-model="hospitalization.weight"
            :required="true"
            :max="100"
            :min="1"
            :step="0.01"
            @update:model-value="emitHospitalization()"
        />

        <BaseSelect
            ref="complaintsRef"
            title="Escolher Queixas"
            data-field="hospitalizationData.complaints"
            v-model="hospitalization.complaints"
            :options="COMPLAINTS"
            :limit="10"
            :search="true"
            @update:model-value="emitHospitalization()"
        />

        <BaseSelect
            ref="diagnosticsRef"
            title="Escolher Diagnosticos"
            data-field="hospitalizationData.diagnostics"
            v-model="hospitalization.diagnostics"
            :options="DIAGNOSTICS"
            :limit="5"
            :search="true"
            @update:model-value="emitHospitalization()"
        />

        <div class="form-container">
            <BaseInput
                title="Data de entrada"
                type="date"
                class="flex-1"
                data-field="hospitalizationData.entryDate"
                v-model="hospitalization.entryDate"
                :required="true"
                @update:model-value="emitHospitalization()"
            />

            <BaseInput
                title="Previsão de Alta Médica"
                type="date"
                class="flex-1"
                data-field="hospitalizationData.dischargeDate"
                v-model="hospitalization.dischargeDate"
                @update:model-value="emitHospitalization()"
            />
        </div>

        <div class="flex items-center space-x-2">
            <input
                type="checkbox"
                data-field="hospitalizationData.useContact"
                :checked="useSpecificContact"
                @change="toggleSpecificContact"
            />
            <label>Usar outro contacto nesta hospitalização</label>
        </div>

        <div v-if="useSpecificContact" class="space-y-3">
            <div class="form-container">
                <BaseInput
                    class="flex-1"
                    placeholder="Nome do contacto"
                    data-field="hospitalizationData.contact.name"
                    v-model="contact.name"
                    :required="true"
                    @update:model-value="emitHospitalization()"
                />
                <BaseInput
                    class="flex-1"
                    pattern="^9[1-9]\d{7}$"
                    help-text="Por favor, insira um número de telefone válido para Angola."
                    placeholder="Telemóvel do contacto"
                    data-field="hospitalizationData.contact.phoneNumber"
                    v-model="contact.phoneNumber"
                    :required="true"
                    @update:model-value="emitHospitalization()"
                />
            </div>

            <div class="flex items-center space-x-2">
                <input
                    type="checkbox"
                    data-field="hospitalizationData.contact.whatsapp"
                    :checked="contact.whatsapp"
                    @change="toggleContactWhatsapp"
                />
                <label>Marque caso este contacto tenha WhatsApp.</label>
            </div>
        </div>
    </section>
</template>
