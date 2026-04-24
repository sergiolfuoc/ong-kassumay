<template>
    <div class="flex flex-wrap justify-center gap-3">
        <NuxtLink
            v-for="tag in tags"
            :key="tag.id"
            :to="`/tags/${tag.slug}`"
            class="group inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm hover:shadow transition"
            :class="activeSlugs?.includes(tag.slug)
                ? 'bg-primary-400/5 border-primary-400 text-primary-600'
                : 'bg-white border-earth-100 text-earth-700 hover:border-primary-400 hover:bg-primary-400/5 hover:text-primary-600'">
            <span class="text-sm font-medium">{{ tag.name }}</span>
            <span
                v-if="tag.total_count"
                class="text-xs px-2 py-0.5 rounded-full bg-earth-100 text-earth-500 group-hover:bg-primary-400/20 group-hover:text-primary-600">
                {{ tag.total_count }}
            </span>
        </NuxtLink>
    </div>

</template>
<script setup lang="ts">
import type { ITagWithCounts } from "~/src/services/tags"

defineProps<{
    tags: ITagWithCounts[]
    activeSlugs?: string[]
}>()
</script>