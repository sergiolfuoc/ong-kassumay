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
            <div v-if="news?.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <NewsCardComp v-for="article in news" :key="article.id" :article="article" />
            </div>
            <p v-else class="text-earth-400 text-center py-12">{{ t("pages.news.index.empty") }}</p>
        </section>

    </div>
</template>
<script setup lang="ts">

const { t } = useI18n()
const { news: newsService } = useServices()
const { data: news } = await useAsyncData("all-news", () => newsService.fetchPublished())

</script>
