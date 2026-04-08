<template>
    <div>
        <label v-if="label" class="block text-sm font-medium text-earth-700 mb-1">{{ label }}</label>
        <slot :has-error="!!error" />
        <p v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</p>
    </div>

</template>
<script setup lang="ts">
defineProps<{
    label?: string
    error?: string
}>()
</script>
