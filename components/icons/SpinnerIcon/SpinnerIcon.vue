<template>
    <span :class="['inline-block border-2 border-current border-t-transparent rounded-full animate-spin', iconClass]" />
</template>

<script setup lang="ts">
withDefaults(defineProps<{ iconClass?: string }>(), { iconClass: "w-4 h-4" })
</script>
