<script lang="ts">
import BaseParameter from './BaseParameter.vue'
import { Parameter } from '@/lib/domain/parameter'
import { reactive, ref } from 'vue'
</script>

<script setup lang="ts">
interface Emits {
    (e: 'state', message: string): void
    (e: 'update:modelValue', value: string): void
}

const emits = defineEmits<Emits>()
const bloodPressure = reactive(new Parameter())
const message = ref<string>('')

const updateValue = () => {
    emits('update:modelValue', bloodPressure.value)
}

function convertToArray(): string[] {
    const pattern = /(\d+)/g
    const matches = bloodPressure.value.match(pattern)
    return matches!
}

function getDis() {
    const values = convertToArray()
    if (values) return parseFloat(values[0])
}

function getSis() {
    const values = convertToArray()
    if (values) return parseFloat(values[1])
}

function parameterState() {
    const dis = getDis()
    const sis = getSis()
    if (bloodPressure.value === '') {
        message.value = ''
    }

    if (dis && sis) {
        if (dis >= 140 && sis >= 90) {
            message.value = 'Hipertensão'
        } else if (dis < 110 && sis < 80) {
            message.value = 'Hipotensão'
        } else if (dis >= 110 && dis <= 140 && sis >= 80 && sis <= 100) {
            message.value = ''
        } else {
            message.value = ''
        }
    }
    emits('state', message.value)
}
defineProps(['latestMeasurement'])
</script>

<template>
    <div class="group-parameter">
        <BaseParameter
            title="Pressão Arterial - Sis/Dis (PAM)"
            helpText="(110/70 - 130/80) mm/Hg - (60)"
            class="flex-1"
            :measurement="latestMeasurement"
        >
            <input
                title="Formato: 110/70 (60)"
                class="form-control"
                placeholder="Valor"
                type="text"
                pattern="^\d+\/\d+ \(\d+\)$"
                v-model="bloodPressure.value"
                :required="bloodPressure.required"
                :class="{ disabled: !bloodPressure.required }"
                @input="updateValue()"
                @keyup="parameterState()"
            />
        </BaseParameter>
        <i
            class="bi cursor-pointer text-xl mt-3"
            @click="bloodPressure.toogleEnable()"
            :class="bloodPressure.required ? 'bi-unlock' : 'bi-lock'"
        ></i>
    </div>
</template>
@/lib/parameter
