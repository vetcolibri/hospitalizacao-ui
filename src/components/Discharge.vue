<script setup lang="ts">
import BaseSelect from '@/components/BaseSelect.vue'
import { DISCHARGES } from '@/lib/data/discharges'
import { type DischargeModel } from '@/lib/models/report'
import { ref } from 'vue'

interface Emits {
    (e: 'add', value: DischargeModel[]): void
}
const emits = defineEmits<Emits>()
const discharges = ref<DischargeModel[]>([
    {
        type: '',
        aspects: []
    }
])

function choose(discharge: DischargeModel, event: Event) {
    const value = (event.target as HTMLSelectElement).value

    discharge.type = value

    emits('add', discharges.value)
}

function add() {
    discharges.value.push({ type: '', aspects: [] })
}

function remove(discharge: DischargeModel) {
    if (discharges.value.length === 1) {
        return
    }

    const dischargeIndex = discharges.value.indexOf(discharge)
    discharges.value.splice(dischargeIndex, 1)

    emits('add', discharges.value)
}
</script>

<template>
    <div class="flex justify-between items-center gap-0">
        <h1>Descargas</h1>
        <i class="bi bi-plus-circle-fill text-gray-500 text-lg cursor-pointer" @click="add()"></i>
    </div>

    <div class="space-y-2" v-for="discharge in discharges" @change="choose(discharge, $event)">
        <select class="form-control text-gray-500" required>
            <option value class="text-gray-500">Escolha um tipo</option>
            <option v-for="opt in DISCHARGES.types" :key="opt" :value="opt" class="text-gray-500">
                {{ opt }}
            </option>
        </select>

        <BaseSelect
            title="Escolha os aspectos"
            :options="DISCHARGES.aspects"
            :limit="DISCHARGES.aspects.length"
            :search="false"
            @update:model-value="discharge.aspects = $event"
        />
        <div class="text-right">
            <i
                v-if="discharges.length > 1"
                class="bi bi-dash-circle text-lg text-right cursor-pointer"
                @click="remove(discharge)"
            ></i>
        </div>
    </div>
</template>

<style scoped></style>
