<script setup lang="ts">
import BaseInput from '@/components/BaseInput.vue'

import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const username = ref<string>('')
const password = ref<string>('')
const router = useRouter()
const auth = useAuth()

const checkUser = () => {
    if (!auth.login(username.value, password.value)) {
        alert('Credencias inválidas')
        return
    }
    router.push({ name: 'Dashboard' })
}
</script>
<template>
    <section class="bg-gray-200 h-screen">
        <div class="flex flex-col justify-center h-full mx-auto max-w-sm">
            <div class="md:shadow-lg bg-white p-6 rounded-md">
                <div class="flex flex-col items-center space-y-4 mb-6">
                    <img src="/img/cvl-192x192.png" width="100" height="100" />
                    <p class="text-gray-500 text-sm text-center">
                        Introduza as suas credencias para entrar.
                    </p>
                </div>
                <form class="space-y-4 w-full sm:max-w-sm mx-auto">
                    <BaseInput
                        v-model="username"
                        placeholder="Utilizador"
                        @keyup.enter="checkUser()"
                    />
                    <BaseInput
                        v-model="password"
                        placeholder="Palavra-passe"
                        type="password"
                        @keyup.enter="checkUser()"
                    />
                    <button
                        type="button"
                        class="btn btn-success w-full"
                        @click="checkUser()"
                        @keyup.enter="checkUser()"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    </section>
</template>
