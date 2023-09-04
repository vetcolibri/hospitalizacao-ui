<script setup lang="ts">
import AlertIcon from '@/components/icons/AlertIcon.vue'
import { iconUrl } from '@/lib/data/patients'
import { type Patient } from '@/lib/types'

defineProps<Patient>()
</script>
<template>
    <section class="shadow-md rounded bg-white relative">
        <router-link :to="`/${$route.params.examFormat}/${id}`">
            <div class="flex p-8 gap-8 items-center mt-6">
                <div class="w-[8rem]">
                    <img :src="iconUrl" alt="pet-foot-image" />
                </div>
                <div class="flex-1 space-y-2">
                    <div class="w-full border-2 rounded text-gray-500 bg-gray-100 px-3 py-2">
                        {{ id }}
                    </div>
                    <div class="w-full border-2 rounded text-gray-500 bg-gray-100 px-3 py-2">
                        {{ name }}
                    </div>
                    <div class="w-full border-2 rounded text-gray-500 bg-gray-100 px-3 py-2">
                        {{ specie }}
                    </div>
                </div>
            </div>
            <div v-if="hasAlert" class="absolute left-3 bottom-3 text-end text-yellow-600">
                <alert-icon class="inline-block" />
            </div>
        </router-link>
    </section>
</template>
