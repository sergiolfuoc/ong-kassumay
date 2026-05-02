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
        <section v-if="topTags?.length" class="bg-warm-50 py-10">
            <div class="max-w-7xl mx-auto px-6">
                <TagChipsComp :tags="topTags" :active-slugs="activeSlugs" />
            </div>
        </section>
    </div>
    <NotFoundBlockComp v-else :message="t('pages.news.slug.notFound')" back-to="/news" :back-label="t('pages.news.slug.back')" />

</template>
<script setup lang="ts">
import { formatDate } from "~/utils/formatDate"

const route = useRoute()
const { news: newsService, tags: tagsService } = useServices()
const { t } = useI18n()

const { data: article } = await useAsyncData(`news-${route.params.slug}`, () => newsService.getBySlug(String(route.params.slug)))
// pedimos un limite alto y recortamos en cliente para poder anadir despues los tags
// del articulo que no esten en el top sin hacer una segunda query
const { data: dbAllTags } = await useAsyncData("top-tags-all", () => tagsService.listTopWithCounts(999))
const { data: articleTagIds } = await useAsyncData(
    () => `news-${article.value?.id ?? "none"}-tags`,
    () => article.value ? tagsService.getTagIdsForNews(article.value.id) : Promise.resolve([]),
    { watch: [article] },
)

const topTags = computed(() => {
    const all = dbAllTags.value ?? []
    const top = all.slice(0, 10)
    const inTopIds = new Set(top.map(t => t.id))
    const ownExtra = all.filter(t => (articleTagIds.value ?? []).includes(t.id) && !inTopIds.has(t.id))
    return [...top, ...ownExtra]
})
const activeSlugs = computed(() => {
    const ids = new Set(articleTagIds.value ?? [])
    return topTags.value.filter(t => ids.has(t.id)).map(t => t.slug)
})

useHead({
    title: article.value?.title || t("composables.useNavigation.news"),
})
</script>
