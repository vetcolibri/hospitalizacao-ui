<script lang="ts">
import { Parameter } from '@/lib/domain/parameter'
import BaseParameter from './BaseParameter.vue'
import { reactive, ref } from 'vue'
</script>

<script setup lang="ts">
interface Emits {
    (e: 'update:modelValue', value: string): void
    (e: 'state', message: string): void
}

const emits = defineEmits<Emits>()
const trc = reactive(new Parameter())
const message = ref<string>('')

enum TrcOptions {
    MaiorQue2Segundos = "> 2'",
    MenorQue2Segundos = "< 2'"
}

function verifyStatus() {
    if (trc.value === '' || trc.value === TrcOptions.MenorQue2Segundos) {
        message.value = ''
        return
    }

    message.value = 'Vasoconstrição'
}

const updateValue = (event: InputEvent) => {
    const value = (event.target as HTMLSelectElement).value
    trc.value = value

    verifyStatus()

    emits('update:modelValue', trc.value)
    emits('state', message.value)
}

defineProps(['latestMeasurement'])
</script>

<template>
    <div class="group-parameter">
        <BaseParameter
            title="TRC"
            helpText="(> 2')"
            class="flex-1"
            :measurement="latestMeasurement"
        >
            <select
                class="form-control text-gray-500"
                :required="trc.required"
                :class="{ disabled: !trc.required }"
                @input="(e) => updateValue(e as InputEvent)"
            >
                <option value>Escolha um valor</option>
                <option :value="TrcOptions.MenorQue2Segundos">Menor que 2'</option>
                <option :value="TrcOptions.MaiorQue2Segundos">Maior que 2'</option>
            </select>
        </BaseParameter>
        <i
            class="bi cursor-pointer text-xl mt-3"
            @click="trc.toogleEnable()"
            :class="trc.required ? 'bi-unlock' : 'bi-lock'"
        ></i>
    </div>
</template>
