<script lang="ts" setup>
import { ref } from "vue"
import AlertIcon from "vue-material-design-icons/Alert.vue"

interface Props {
    rate: string
    parameters: string[],
    comment: string,
}

const isVisible = ref(true)

function closeDialog(){
    isVisible.value = false;
}

defineProps<Props>()

</script>
<template>
    <dialog v-if="isVisible" class="flex items-center absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50">
        <div class="w-1/2 mx-auto border rounded bg-white p-3">
            <h1 class="font-medium text-center uppercase">Alerta</h1>
            <div class="space-y-3 mt-4">
                <div class="flex justify-between items-center">
                    <p>Parâmetros:</p>
                    <span class="text-xs text-red-500">A cada {{ rate }}</span>
                </div>
                <ul class="mx-4">
                    <li 
                        :key="parameter" 
                        v-for="parameter in parameters" 
                        class="w-full flex items-center gap-2">
                        <alert-icon class="text-yellow-600"/>
                        {{ parameter }}
                    </li>
                </ul>
                <p>{{ comment }}</p>
            </div>
            <div class="mt-4 space-y-2">
                <div class="flex items-center">
                    <input type="checkbox" name="notShowAgain" id="notShowAgainId" class="rounded">
                    <label for="create-alert" class="block ml-2 text-sm text-gray-900">Não mostrar novamente</label>
                </div>
                <button 
                    class="w-full rounded text-white bg-gray-600 hover:bg-gray-800 p-3"
                    @click="closeDialog"
                >Confirmar</button>
            </div>
        </div>
    </dialog>
</template>