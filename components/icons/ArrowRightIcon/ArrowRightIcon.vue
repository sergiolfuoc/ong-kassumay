<template>
    <svg :class="iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ iconClass?: string }>(), { iconClass: "w-4 h-4" })
</script>
