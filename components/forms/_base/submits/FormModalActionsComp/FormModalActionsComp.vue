<template>
    <div>
        <p v-if="serverError" class="text-red-600 text-sm mb-2">{{ serverError }}</p>
        <div class="flex gap-3 justify-end">
            <button
                class="border border-gray-300 text-earth-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
                @click="$emit('cancel')"
            >
                {{ cancelLabel }}
            </button>
            <button
                class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition"
                @click="$emit('save')"
            >
                {{ saveLabel }}
            </button>
        </div>
    </div>

</template>
<script setup lang="ts">
defineProps<{
    saveLabel: string
    cancelLabel: string
    serverError?: string
}>()

defineEmits(["cancel", "save"])
</script>
