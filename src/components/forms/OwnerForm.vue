<script setup lang="ts">
import BaseInput from '@/components/BaseInput.vue';
import { myAlert } from '@/lib/myAlert';
import type { OwnerModel } from '@/lib/models/owner';
import { Provided } from '@/lib/provided';
import type { CrmService } from '@/lib/services/crm_service';
import { inject, ref } from 'vue';

const owner = ref<OwnerModel>({ ownerId: '', name: '', phoneNumber: '', whatsapp: false });
const ownerExists = ref<boolean>(false);
// Fotografia da ficha carregada do servidor: permite saber se o utilizador alterou
// algo e enviar apenas a edição efectiva, sem reescrever dados inalterados.
const loadedOwner = ref<OwnerModel | null>(null);
// O tutor do paciente seleccionado está por resolver: enquanto a pesquisa decorre (ou
// depois de falhar) não se pode submeter, para não gravar outro tutor nem criar um duplicado.
const pending = ref<boolean>(false);

const emits = defineEmits<{
    (e: 'owner', value: OwnerModel): void;
    (e: 'pending', value: boolean): void;
}>();
const crmService = <CrmService>inject(Provided.CrmService)!;

function setPending(value: boolean) {
    if (pending.value === value) return;

    pending.value = value;
    emits('pending', value);
}

async function findOwner(ownerId: string) {
    if (!ownerId) {
        clear();
        return;
    }

    // Qualquer alteração ao ID invalida já o tutor anterior.
    ownerExists.value = false;
    loadedOwner.value = null;
    owner.value = { ownerId, name: '', phoneNumber: '', whatsapp: false };
    emits('owner', owner.value);
    setPending(true);

    const ownerOrErr = await crmService.findOwner(ownerId);

    // Ignora uma resposta antiga se o ID entretanto mudou.
    if (owner.value.ownerId !== ownerId) return;

    if (ownerOrErr.isRight()) {
        ownerExists.value = true;
        loadedOwner.value = { ...ownerOrErr.value };
        owner.value = { ...ownerOrErr.value };
        emits('owner', owner.value);
        setPending(false);
        return;
    }

    // 404: não existe tutor com este ID, pode ser registado um novo.
    if (ownerOrErr.value.status === 404) {
        ownerExists.value = false;
        loadedOwner.value = null;
        owner.value = { ownerId, name: '', phoneNumber: '', whatsapp: false };
        emits('owner', owner.value);
        setPending(false);
        return;
    }

    // Falha transitória ou de autorização: não pode ser tratada como tutor novo.
    myAlert('Erro ao procurar o tutor', ownerOrErr.value);
    // O tutor fica por resolver: nova pesquisa (mudar o ID) desbloqueia a submissão.
}

/**
 * Devolve os dados globais a actualizar quando o utilizador corrigiu a ficha do
 * tutor existente. Sem alterações devolve undefined, para não escrever nada.
 */
function ownerChange(): OwnerModel | undefined {
    const original = loadedOwner.value;
    if (!ownerExists.value || !original) return undefined;

    const changed = owner.value.name !== original.name ||
        owner.value.phoneNumber !== original.phoneNumber ||
        owner.value.whatsapp !== original.whatsapp;

    if (!changed) return undefined;

    return { ...owner.value };
}

function clear() {
    // Invalidação explícita (paciente anterior ou formulário já submetido): limpa SEMPRE
    // todos os campos e emite o tutor limpo, para nenhum dado antigo sobreviver.
    ownerExists.value = false;
    loadedOwner.value = null;
    owner.value = { ownerId: '', name: '', phoneNumber: '', whatsapp: false };
    emits('owner', owner.value);
    setPending(false);
}

defineExpose({
    clear,
    findOwner,
    ownerChange
});
</script>
<template>
    <div class="space-y-3">
        <BaseInput
            placeholder="ID Proprietário"
            data-field="ownerData.ownerId"
            v-model="owner.ownerId"
            :required="true"
            @update:model-value="findOwner($event)"
        />

        <p v-if="ownerExists" class="text-sm text-amber-600">
            Alterar estes dados actualiza a ficha geral do tutor.
        </p>

        <div class="form-container">
            <BaseInput
                class="flex-1"
                v-model="owner.name"
                data-field="ownerData.name"
                :placeholder="ownerExists ? owner.name : 'Nome do Proprietário'"
                :required="true"
                @update:model-value="$emit('owner', owner)"
            />
            <BaseInput
                class="flex-1"
                pattern="^9[1-9]\d{7}$"
                help-text="Por favor, insira um número de telefone válido para Angola."
                data-field="ownerData.phoneNumber"
                v-model="owner.phoneNumber"
                :placeholder="ownerExists ? owner.phoneNumber : 'Telemóvel'"
                :required="true"
                @update:model-value="$emit('owner', owner)"
            />
        </div>

        <div class="flex items-center space-x-2">
            <input
                type="checkbox"
                data-field="ownerData.whatsapp"
                v-model="owner.whatsapp"
                @change="$emit('owner', owner)"
            />
            <label for="whatsapp">Marque caso o proprietário do paciente tenha WhatsApp.</label>
        </div>

        <div v-if="ownerExists">
            <p v-if="owner.whatsapp">Proprietário tem WhatsApp.</p>
            <p v-else>Proprietário não tem WhatsApp.</p>
        </div>
    </div>
</template>
