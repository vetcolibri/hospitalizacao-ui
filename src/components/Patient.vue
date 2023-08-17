<script setup lang="ts">
import AlertIcon from "vue-material-design-icons/AlertCircle.vue"

import { Alert, Patient } from '@/lib/types';
import { ref } from "vue";

const patientId = ref<string>()

function hasAlert(alerts: Alert[] | undefined){
    return alerts?.find((alert) => alert.status === true)
}

const props = defineProps<Patient>()
</script>
<template>
    <section class="shadow-md rounded bg-white relative">
        <router-link :to="`/${$route.params.examFormat}`" v-model="patientId">
            <div class="flex p-8 gap-8 items-center mt-6">
                <div class="w-[8rem]">
                    <img :src="props.iconUrl" alt="pet-foot-image">
                </div>
                <div class="flex-1 space-y-2">
                    <div class="w-full border-2 rounded text-gray-500 bg-gray-100 px-3 py-2">
                        {{ props.id }}
                    </div>
                    <div class="w-full border-2 rounded text-gray-500 bg-gray-100 px-3 py-2">
                        {{ props.name }}
                    </div>
                    <div class="w-full border-2 rounded text-gray-500 bg-gray-100 px-3 py-2">
                        {{ props.specie }}
                    </div>
                </div>
            </div>
            <div v-if="hasAlert(props.alerts)" class="absolute left-3 bottom-1 text-end text-yellow-600">
                <alert-icon class="inline-block" />
            </div>
        </router-link>
    </section>
</template>
