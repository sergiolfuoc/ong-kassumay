<template>
    <div>
        <PageHeroComp
            :tag="t('pages.news.index.tag')"
            :title="t('pages.news.index.title')"
            :subtitle="t('pages.news.index.subtitle')"
            image="/images/heroes/4-Desbrossar-Horta-Kourègue.jpg"
            from="earth" to="kassumay" size="MD"
        />

        <section class="max-w-6xl mx-auto px-6 py-12 md:py-16">
            <div v-if="items.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <NewsCardComp v-for="article in items" :key="article.id" :article="article" />
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
const { news: newsService } = useServices()

const totalsPerPage = 12
const { data: firstPage } = await useAsyncData("all-news", () => newsService.fetchPublished({ limit: totalsPerPage }))
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