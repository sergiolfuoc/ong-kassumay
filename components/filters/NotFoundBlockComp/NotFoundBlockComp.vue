<template>
    <div class="text-center py-20">
        <p class="text-earth-400 text-lg">{{ message }}</p>
        <NuxtLink :to="backTo" class="mt-4 inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-semibold transition">
            <ArrowLeftIcon />
            {{ backLabel }}
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
defineProps<{ message: string; backTo: string; backLabel: string }>()
</script>
