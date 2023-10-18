<script setup lang="ts">
import { useNotificationStore } from '@/store/notificationStore'
const store = useNotificationStore()

function close() {
    store.visible = false
}
</script>

<template>
    <div v-if="store.visible" class="alert alert-success">
        <div class="ml-3 text-sm font-medium">
            {{ store.message }}
        </div>
        <button class="alert-btn-dismiss alert-btn-dismiss-success" @click="close()">
            <!-- <i class="bi bi-x"></i> -->
        </button>
    </div>
</template>
