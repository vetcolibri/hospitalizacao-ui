<script setup lang="ts">
import BaseInput from '@/components/BaseInput.vue'
import type { OwnerModel } from '@/lib/models/owner'
import { Provided } from '@/lib/provided'
import type { OwnerService } from '@/lib/services/owner_service'
import { ref, onMounted, inject } from 'vue'
const owners = ref<OwnerModel[]>([])

const owner = ref({ ownerId: '', name: '', phoneNumber: '' })
const ownerExists = ref<boolean>(false)

const emits = defineEmits<{ (e: 'owner', value: OwnerModel): void }>()
const ownerService = <OwnerService>inject(Provided.OwnerService)!

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
        phoneNumber: voidOrOwner.phoneNumber
    }
    emits('owner', owner.value)
}

function clearOwnerData() {
    if (!owner.value.name || !owner.value.phoneNumber) return

    ownerExists.value = false
    owner.value = { ownerId: '', name: '', phoneNumber: '' }
    emits('owner', owner.value)
}

onMounted(async () => {
    owners.value = await ownerService.getAll()
})
</script>
<template>
    <div class="space-y-3">
        <BaseInput
            placeholder="ID Próprietário"
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
    </div>
</template>
