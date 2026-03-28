<template>
    <div v-if="article">
        <DetailHeroComp :image-url="article.image_url" back-to="/news" :back-label="t('pages.news.slug.back')" :title="article.title">
            <template #meta>
                <time class="text-primary-300 text-sm font-medium mt-4 block">
                    {{ formatDate(article.created_at) }}
                </time>
            </template>
        </DetailHeroComp>
        <article class="max-w-3xl mx-auto px-6 py-12">
            <SanitizedContentComp :html="article.content" />
        </article>
    </div>
    <NotFoundBlockComp v-else :message="t('pages.news.slug.notFound')" back-to="/news" :back-label="t('pages.news.slug.back')" />

</template>
<script setup lang="ts">
import { formatDate } from "~/utils/formatDate"

const route = useRoute()
const { news: newsService } = useServices()
const { t } = useI18n()

const { data: article } = await useAsyncData(`news-${route.params.slug}`, () => newsService.getBySlug(String(route.params.slug)))

useHead({
    title: article.value?.title || t("composables.useNavigation.news"),
})
</script>
