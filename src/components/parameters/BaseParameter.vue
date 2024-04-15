<script lang="ts" setup>
import { vLatestMeasurement } from '@/lib/directives'

interface Props {
    parameter: any
    measurement?: any
    visibility?: boolean
    viewLockIcon?: boolean
}

withDefaults(defineProps<Props>(), { visibility: true, viewLockIcon: true })
</script>

<template>
    <section v-if="visibility">
        <div class="flex items-center justify-between p-1 border-b mb-2 border-gray-300">
            <span class="font-medium">{{ parameter.title }}</span>
            <i
                v-if="viewLockIcon"
                class="cursor-pointer text-base"
                :class="parameter.required ? 'bi bi-unlock' : 'bi bi-lock'"
                @click="parameter.toggleRequired()"
            >
            </i>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
            <input
                v-if="!parameter.options && parameter.name !== 'bloodPressure'"
                class="form-control"
                placeholder="Valor"
                :type="parameter.type ? parameter.type : 'text'"
                :min="parameter.min"
                :max="parameter.max"
                :class="{ disabled: !parameter.required }"
                :required="parameter.required"
                :step="0.01"
                v-model="parameter.value"
                @keyup="parameter.verifyStatus()"
            />

            <input
                v-if="parameter.name === 'bloodPressure'"
                class="form-control"
                placeholder="Valor"
                type="text"
                pattern="^\d+\/\d+ \(\d+\)$"
                :required="parameter.required"
                :class="{ disabled: !parameter.required }"
                v-model="parameter.value"
                @keyup="parameter.verifyStatus()"
            />

            <select
                v-if="parameter.options"
                class="form-control text-black"
                v-model="parameter.value"
                :required="parameter.required"
                :class="{ disabled: !parameter.required }"
                @change="parameter.verifyStatus()"
            >
                <option value class="text-gray-500">Escolha um valor</option>
                <option
                    v-for="opt in parameter.options"
                    :key="opt"
                    :value="opt"
                    class="text-gray-500"
                >
                    {{ opt }}
                </option>
            </select>

            <input class="form-disabled" :placeholder="measurement ? measurement.value : 'N/D'" />
        </div>

        <div class="flex items-center justify-between gap-4 mt-1 text-gray-500 sm:justify-normal">
            <span class="text-xs sm:text-sm sm:w-full">{{ parameter.helpText }}</span>
            <span
                v-if="measurement"
                v-latest-measurement="measurement.issuedAt"
                class="text-xs sm:text-sm sm:w-full"
            ></span>
        </div>
    </section>
</template>
