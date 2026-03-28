<template>
    <NuxtLink :to="to" class="group bg-white rounded-2xl border border-earth-100 hover:shadow-xl transition-all duration-300 overflow-hidden block">
        <div class="relative overflow-hidden">
            <img v-if="imageUrl" :src="imageUrl" :alt="imageAlt" class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
            <div v-else class="w-full h-56 bg-warm-50 flex items-center justify-center">
                <slot name="placeholder-icon" />
            </div>
            <slot name="badge" />
        </div>
        <div class="p-6">
            <slot />
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
    to: string
    imageUrl?: string | null
    imageAlt?: string
}>()
</script>
