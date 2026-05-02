<template>
    <div>
        <PageHeroComp
            :tag="t('pages.news.index.tag')"
            :title="t('pages.news.index.title')"
            :subtitle="t('pages.news.index.subtitle')"
            image="/images/heroes/4-Desbrossar-Horta-Kourègue.jpg"
            from="earth" to="transparent" size="MD"
        />

        <section v-if="topTags?.length" class="bg-warm-50 py-10">
            <div class="max-w-7xl mx-auto px-6">
                <TagChipsComp :tags="topTags" />
            </div>
        </section>

        <section class="max-w-6xl mx-auto px-6 py-12 md:py-16">
            <div v-if="items.length" class="flex flex-wrap justify-center gap-8">
                <NewsCardComp v-for="article in items" :key="article.id" :article="article" class="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]" />
            </div>
            <p v-else class="text-earth-400 text-center py-12">{{ t("pages.news.index.empty") }}</p>

            <div v-if="timeStamp" class="flex justify-center mt-10">
                <button
                    type="button"
                    class="px-5 py-2 rounded-full border border-earth-300 hover:bg-earth-50 disabled:opacity-50"
                    :disabled="loadingMore"
                    @click="loadMore"
                >
                    {{ t("pages.news.index.loadMore") }}
                </button>
            </div>
        </section>
    </div>

</template>
<script setup lang="ts">
import type { INewsModel } from "~/src/types"

const { t } = useI18n()
const { news: newsService, tags: tagsService } = useServices()

const totalsPerPage = 12
const { data: firstPage } = await useAsyncData("all-news", () => newsService.fetchPublished({ limit: totalsPerPage }))
const { data: topTagsData } = await useAsyncData("home-tags", () => tagsService.listTopWithCounts(10))
const topTags = computed(() => topTagsData.value ?? [])
const items = ref<INewsModel[]>(firstPage.value?.rows ?? [])
const timeStamp = ref<string | null>(firstPage.value?.nextTimeStamp ?? null)
    const loadingMore = ref(false)

async function loadMore() {
    if (!timeStamp.value || loadingMore.value) return
    loadingMore.value = true
    try {
        const { rows, nextTimeStamp } = await newsService.fetchPublished({ timeStamp: timeStamp.value, limit: totalsPerPage })
        items.value.push(...rows)
        timeStamp.value = nextTimeStamp
    } finally {
        loadingMore.value = false
    }
}
</script>