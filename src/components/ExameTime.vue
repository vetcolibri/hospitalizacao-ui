<script setup lang="ts">
interface Props {
    today: string
    hour: string
}

const props = defineProps<Props>()

</script>
<template>
    <div>
        <div class="flex justify-end gap-3">
            <div class="p-2 border rounded bg-gray-100">{{  props.today }}</div>
            <div class="p-2 border rounded bg-gray-100">{{ props.hour }}</div>
        </div>
    </div>
</template>