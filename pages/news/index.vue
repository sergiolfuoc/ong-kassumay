<template>
    <div>

        <section class="relative overflow-hidden">
            <div class="absolute inset-0 bg-[url('/images/heroes/senegal-grupo.jpg')] bg-cover bg-top" />
                <div class="absolute inset-0 bg-kassumay-950/30" />
            <div class="absolute inset-0 bg-black/20" />
            <div class="relative max-w-7xl mx-auto px-6 py-24 md:py-32 text-center [text-shadow:_0_3px_30px_rgba(0,0,0,1)]">
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-3">{{ t("pages.news.index.title") }}</h1>
                <p class="text-warm-100/85 text-lg max-w-2xl mx-auto">{{ t("pages.news.index.subtitle") }}</p>
                <span
                    class="inline-block bg-white/10 text-warm-100/85 text-xs font-medium px-3 py-1 rounded-lg uppercase tracking-wide mt-5 border border-white/20"
                    >{{ t("pages.news.index.tag") }}</span
                >
            </div>
        </section>

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
