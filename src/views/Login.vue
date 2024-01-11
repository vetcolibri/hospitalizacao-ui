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
    const loggedIn = auth.login(username.value, password.value)
    if (!loggedIn) {
        alert('Credenciais inválidas')
        return
    }
    router.push({ name: 'Dashboard' })
}
</script>
<template>
    <section class="bg-white h-screen">
        <div class="flex flex-col justify-center h-full mx-auto md:max-w-sm">
            <div class="md:shadow-lg p-6 rounded">
                <div class="flex flex-col items-center space-y-4 mb-6">
                    <img src="/img/cvl-192x192.png" width="100" height="100" />
                    <p class="text-gray-500 text-sm text-center">
                        Introduza as suas credencias para entrar.
                    </p>
                </div>
                <form class="space-y-4 w-full sm:max-w-sm mx-auto">
                    <BaseInput v-model="username" placeholder="Utilizador" />
                    <BaseInput v-model="password" placeholder="Palavra-passe" type="password" />
                    <button type="button" class="btn btn-success w-full" @click="checkUser()">
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    </section>
</template>
