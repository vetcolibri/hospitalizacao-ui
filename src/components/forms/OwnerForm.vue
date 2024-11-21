<script setup lang="ts">
import BaseInput from '@/components/BaseInput.vue'
import type { OwnerModel } from '@/lib/models/owner'
import { Provided } from '@/lib/provided'
import type { CrmService } from '@/lib/services/crm_service'
import { inject, onMounted, ref } from 'vue'
const owners = ref<OwnerModel[]>([])

const owner = ref({ ownerId: '', name: '', phoneNumber: '', whatsapp: false })
const ownerExists = ref<boolean>(false)

const emits = defineEmits<{ (e: 'owner', value: OwnerModel): void }>()
const crmService = <CrmService>inject(Provided.CrmService)!

function findOwner(ownerId: string) {
    if (!ownerId) {
        clearOwnerData()
        return
    }

    const voidOrOwner = owners.value.find((o) => o.ownerId === ownerId)

    if (!voidOrOwner) {
        clearOwnerData()
        owner.value.ownerId = ownerId
        emits('owner', owner.value)
        return
    }

    ownerExists.value = true
    owner.value = {
        ownerId: voidOrOwner.ownerId,
        name: voidOrOwner.name,
        phoneNumber: voidOrOwner.phoneNumber,
        whatsapp: voidOrOwner.whatsapp
    }
    emits('owner', owner.value)
}

function clearOwnerData() {
    if (!owner.value.name || !owner.value.phoneNumber) return

    ownerExists.value = false
    owner.value = { ownerId: '', name: '', phoneNumber: '', whatsapp: false }
    emits('owner', owner.value)
}

function clear() {
    clearOwnerData()
}

defineExpose({ clear })

onMounted(async () => {
    owners.value = await crmService.getOwners()
})
</script>
<template>
    <div class="space-y-3">
        <BaseInput
            placeholder="ID Proprietário"
            v-model="owner.ownerId"
            :required="true"
            @update:model-value="findOwner($event)"
        />

        <div class="form-container">
            <BaseInput
                class="flex-1"
                v-model="owner.name"
                :placeholder="ownerExists ? owner.name : 'Nome do Proprietário'"
                :required="true"
                :disabled="ownerExists"
                @update:model-value="$emit('owner', owner)"
            />
            <BaseInput
                class="flex-1"
                pattern="^9[1-5]\d{7}$"
                help-text="Por favor, insira um número de telefone válido para Angola."
                v-model="owner.phoneNumber"
                :placeholder="ownerExists ? owner.phoneNumber : 'Telemóvel'"
                :required="true"
                :disabled="ownerExists"
                @update:model-value="$emit('owner', owner)"
            />
        </div>
        <div v-if="!ownerExists" class="flex items-center space-x-2">
            <input type="checkbox" v-model="owner.whatsapp" />
            <label for="whatsapp">Marque caso o proprietário do paciente tenha WhatsApp.</label>
        </div>
        <div v-else>
            <p v-if="owner.whatsapp">Proprietário tem WhatsApp.</p>
            <p v-else>Proprietário não tem WhatsApp.</p>
        </div>
    </div>
</template>
