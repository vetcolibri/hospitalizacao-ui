<script setup lang="ts">
import { Patient } from '@/lib/types';

const props = defineProps<Patient>()

</script>
<template>
    <section class="shadow-md rounded bg-white">
        <router-link :to="`/${$route.params.examFormat}`">
            <div class="flex p-8 gap-8 items-center mt-6">
                <div class="w-[8rem]">
                    <img src="https://cdn4.iconfinder.com/data/icons/social-messaging-productivity-black-4/1/101_13-512.png" alt="pet-foot-image">
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
        </router-link>
    </section>
</template>
