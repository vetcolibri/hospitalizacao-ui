<script setup lang="ts">

defineProps(["patientId", "name", "specie"])

</script>
<template>
    <section class="shadow-md rounded bg-white">
        <router-link :to="`/${$route.params.examFormat}`">
            <div class="flex p-8 gap-8 items-center">
                <div class="w-[8rem]">
                    <img src="https://cdn4.iconfinder.com/data/icons/social-messaging-productivity-black-4/1/101_13-512.png" alt="pet-foot-image">
                </div>
                <div class="flex-1 space-y-2">
                    <div class="w-full border-2 rounded text-gray-500 bg-gray-100 px-3 py-2">
                        {{ patientId }}
                    </div>
                    <div class="w-full border-2 rounded text-gray-500 bg-gray-100 px-3 py-2">
                        {{ name }}
                    </div>
                    <div class="w-full border-2 rounded text-gray-500 bg-gray-100 px-3 py-2">
                        {{ specie }}
                    </div>
                </div>
            </div>
        </router-link>
    </section>
</template>
