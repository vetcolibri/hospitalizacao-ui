<script setup lang="ts">
import { iconUrl } from '@/lib/data/patients'
import { makeDateFormat } from '@/lib/shared/utils'
import { ref } from 'vue'
import type { Patient } from '@/models/patient'

const date = ref()
const props = defineProps<Patient>()
date.value = makeDateFormat(new Date(props.entryDate))
</script>
<template>
    <router-link :to="`/${$route.params.page}/${patientId}`">
        <section class="w-full bg-white border border-gray-200 rounded shadow relative">
            <div class="flex flex-col items-center p-8">
                <img class="w-16 h-16 md:w-24 md:h-24" :src="iconUrl" alt="patient-icon" />
                <h5 class="mb-1 text-sm md:text-lg font-medium text-gray-500">{{ patientId }}</h5>
                <h5 class="mb-1 text-sm md:text-lg font-medium text-gray-900">{{ name }}</h5>
                <span class="text-sm text-gray-500">{{ specie }}</span>
                <div class="text-sm text-gray-500 space-x-1 mb-1">
                    <i class="bi bi-clock"></i>
                    <span>{{ date }}</span>
                </div>
                <i
                    v-if="hasAlert"
                    class="bi bi-exclamation-triangle-fill md:text-lg text-yellow-600"
                ></i>
            </div>
        </section>
    </router-link>
</template>
