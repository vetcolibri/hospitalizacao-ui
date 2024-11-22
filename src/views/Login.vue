<script setup lang="ts">
import BaseInput from '@/components/BaseInput.vue'

import { ref, inject } from 'vue'
import { useAuth } from '@/composables/useAuth'
import type { AuthService } from '@/lib/services/auth_service'
import { Provided } from '@/lib/provided'

const username = ref<string>('')
const password = ref<string>('')
const errorMessage = ref<string>('')
const auth = useAuth()

const authService = inject<AuthService>(Provided.AuthService)!

const checkUser = async () => {
    if (!username.value || !password.value) {
        errorMessage.value = 'Informe as suas credências de acesso'
        return
    }

    const userOrErr = await authService.login(username.value, password.value)
    if (userOrErr.isLeft()) {
        errorMessage.value = 'Credências inválidas'
        return
    }

    errorMessage.value = ''
    auth.login(userOrErr.value)
}
</script>
<template>
    <section class="bg-gray-200 h-screen">
        <div class="flex flex-col justify-center h-full mx-auto max-w-sm">
            <div class="md:shadow-lg bg-white p-6 rounded-md">
                <div class="flex flex-col items-center space-y-4 mb-6">
                    <img src="/img/cvl-192x192.png" width="100" height="100" />
                    <p v-if="!errorMessage" class="text-gray-500 text-sm text-center">
                        Introduza as suas credencias para entrar.
                    </p>
                    <p v-else class="text-red-500 text-sm text-center">{{ errorMessage }}</p>
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
