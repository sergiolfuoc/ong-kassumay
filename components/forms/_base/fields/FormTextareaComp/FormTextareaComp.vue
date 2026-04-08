<template>
    <textarea
        :value="modelValue ?? ''"
        :rows="rows"
        :placeholder="placeholder"
        class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        :class="hasError ? 'border-red-400 ring-1 ring-red-400' : ''"
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />

</template>
<script setup lang="ts">
defineProps<{
    modelValue: string | null | undefined
    rows?: number | string
    placeholder?: string
    hasError?: boolean
}>()

defineEmits(["update:modelValue"])
</script>
