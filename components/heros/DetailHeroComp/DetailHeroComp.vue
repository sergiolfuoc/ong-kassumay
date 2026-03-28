<template>
    <section class="relative overflow-hidden">
        <div
            v-if="imageUrl"
            class="absolute inset-0"
            :style="{ backgroundImage: `url(${imageUrl})` }"
            style="background-size: cover; background-position: center"
        />
        <div class="absolute inset-0 bg-earth-950/70" />
        <div class="relative max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
            <NuxtLink :to="backTo" class="inline-flex items-center gap-1 text-primary-300 hover:text-primary-200 text-sm font-medium transition mb-6">
                <ArrowLeftIcon />
                {{ backLabel }}
            </NuxtLink>
            <h1 class="text-3xl md:text-5xl font-display font-bold text-white max-w-3xl mx-auto">{{ title }}</h1>
            <slot name="meta" />
        </div>
    </section>
</template>

<script setup lang="ts">
defineProps<{
    imageUrl?: string | null
    backTo: string
    backLabel: string
    title: string
}>()
</script>
