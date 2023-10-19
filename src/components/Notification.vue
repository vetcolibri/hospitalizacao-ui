<script setup lang="ts">
import { useNotificationStore } from '@/store/notificationStore'
const store = useNotificationStore()

enum AlertType {
    WARNING = 'warning',
    SUCCESS = 'success',
    INFO = 'info'
}

function close() {
    store.visible = false
}
</script>

<template>
    <div v-if="store.visible && store.type === AlertType.WARNING" class="alert alert-warning">
        <div class="ml-3 text-sm font-medium flex items-center gap-2">
            <i class="bi bi-exclamation-circle-fill"></i>
            <span>{{ store.message }}</span>
        </div>
        <button class="alert-btn-dismiss alert-btn-dismiss-warning" @click="close()">
            <i class="bi bi-x-lg"></i>
        </button>
    </div>
    <div v-if="store.visible && store.type === AlertType.SUCCESS" class="alert alert-success">
        <div class="ml-3 text-sm font-medium">
            {{ store.message }}
        </div>
        <button class="alert-btn-dismiss alert-btn-dismiss-success" @click="close()">
            <i class="bi bi-x-lg"></i>
        </button>
    </div>
</template>
