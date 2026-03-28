<template>
    <div>
        <p v-if="error" class="text-red-600 text-sm mb-3">{{ error }}</p>
        <p v-if="success" class="text-green-600 text-sm mb-3">{{ success }}</p>
        <div class="flex gap-4">
            <button type="submit" :disabled="loading || disabled" :class="buttonClass || 'bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition'">
                {{ loading ? loadingLabel : label }}
            </button>
            <NuxtLink v-if="cancelTo" :to="cancelTo" class="px-6 py-2 text-gray-600 hover:text-gray-800">
                {{ cancelLabel }}
            </NuxtLink>
            <button v-else-if="cancelLabel" type="button" class="px-6 py-2 text-gray-600 hover:text-gray-800" @click="$emit('cancel')">
                {{ cancelLabel }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    loading: boolean
    label: string
    loadingLabel: string
    error?: string | null
    success?: string | null
    cancelTo?: string
    cancelLabel?: string
    buttonClass?: string
    disabled?: boolean
}>()

defineEmits(["cancel"])
</script>
