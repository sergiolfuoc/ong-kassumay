<template>
    <BaseCardComp :to="`/news/${article.slug}`" :image-url="article.image_url" :image-alt="article.title">
        <template #placeholder-icon>
            <NewspaperIcon icon-class="w-12 h-12 text-warm-300" />
        </template>

        <time class="text-xs text-primary-500 font-semibold">
            {{ formatDate(article.created_at) }}
        </time>
        <h3 class="text-lg font-bold text-earth-900 mt-2 line-clamp-3 group-hover:text-primary-500 transition-colors">
            {{ article.title }}
        </h3>
        <div class="mt-auto pt-2">
            <p v-if="article.excerpt" class="text-earth-500 text-sm line-clamp-3">
                {{ article.excerpt }}
            </p>
            <span class="mt-3 text-primary-500 text-sm font-semibold group-hover:text-primary-600 transition-colors inline-flex items-center gap-1">
                {{ t("components.cards.NewsCardComp.readMore") }}
                <ArrowRightIcon />
            </span>
        </div>
    </BaseCardComp>
</template>
<script setup lang="ts">
import type { INewsModel } from "~/src/types"
import { formatDate } from "~/utils/formatDate"

const { t } = useI18n()
defineProps<{ article: INewsModel }>()
</script>
