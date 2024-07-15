<script setup lang="ts">
import { STATE_OF_CONSCIOUSNESS } from '@/lib/data/state_of_consciousness'
import { DISCHARGES } from '@/lib/data/discharges'
import { FOOD } from '@/lib/data/food'
import { ref } from 'vue'
import BaseDialog from './BaseDialog.vue'
import BaseSelect from './BaseSelect.vue'

const dialogRef = ref<typeof BaseDialog>()

function open() {
    dialogRef.value?.open()
}

defineExpose({ open })
</script>

<template>
    <BaseDialog ref="dialogRef" title="Informações para o Tutor">
        <div class="space-y-3">
            <h1>Estado de Consciencia</h1>
            <BaseSelect
                title="Escolha as opções"
                :options="STATE_OF_CONSCIOUSNESS"
                :limit="STATE_OF_CONSCIOUSNESS.length"
            />

            <h1>Alimentação</h1>
            <BaseSelect title="Escolha os tipos" :options="FOOD.types" :limit="FOOD.types.length" />

            <select class="form-control text-gray-500">
                <option value class="text-gray-500">Escolha um nível</option>
                <option
                    v-for="opt in FOOD.levels"
                    :key="opt.level"
                    :value="opt.level"
                    class="text-gray-500"
                >
                    {{ opt.level }} - {{ opt.description }}
                </option>
            </select>

            <h1>Descargas</h1>

            <select class="form-control text-gray-500">
                <option value class="text-gray-500">Escolha um tipo</option>
                <option
                    v-for="opt in DISCHARGES.types"
                    :key="opt"
                    :value="opt"
                    class="text-gray-500"
                >
                    {{ opt }}
                </option>
            </select>

            <select class="form-control text-gray-500">
                <option value class="text-gray-500">Escolha um aspecto</option>
                <option
                    v-for="opt in DISCHARGES.aspects"
                    :key="opt"
                    :value="opt"
                    class="text-gray-500"
                >
                    {{ opt }}
                </option>
            </select>

            <h1>Observações</h1>
            <textarea
                name="comments"
                class="form-control resize-none focus:ring-0 overflow-hidden"
                placeholder="Comentário do MedVet"
                rows="4"
            />

            <button class="btn btn-success w-full uppercase">
                <i class="bi bi-floppy2 mr-2"></i>
                Salvar
            </button>
        </div>
    </BaseDialog>
</template>
