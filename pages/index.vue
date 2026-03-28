<template>
    <div>
        <!-- hero -->
        <section class="relative min-h-[90vh] flex items-center overflow-hidden">
            <div class="absolute inset-0 bg-[url('/images/heroes/home-hero.jpg')] bg-cover bg-center" />
            <div class="absolute inset-0 bg-gradient-to-r from-earth-950/80 via-earth-950/60 to-earth-950/30" />
            <div class="relative max-w-7xl mx-auto px-6 py-20 w-full">
                <div class="max-w-2xl">
                    <span
                        class="inline-flex items-center gap-2 bg-primary-400/20 text-primary-300 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6 backdrop-blur-sm border border-primary-400/20"
                    >
                        <BrandHeartIcon :size="16" class="text-primary-300" />
                        {{ t("pages.index.hero.tag") }}
                    </span>
                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight" v-html="t('pages.index.hero.title', { br: '<br/>' })" />
                    <p class="text-warm-200 text-lg md:text-xl mt-6 leading-relaxed max-w-lg">
                        {{ t("pages.index.hero.subtitle") }}
                    </p>
                </div>
            </div>
        </section>

        <!-- news -->
        <section class="max-w-7xl mx-auto px-6 py-16">
            <div class="text-center mb-10">
                <h2 class="text-3xl font-display font-bold text-earth-900">{{ t("pages.index.latestNews.title") }}</h2>
                <p class="text-earth-500 mt-2">{{ t("pages.index.latestNews.tagline") }}</p>
            </div>
            <div v-if="latestNews?.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <NewsCardComp v-for="article in latestNews" :key="article.id" :article="article" />
            </div>
            <p v-else class="text-earth-400 text-center py-8">{{ t("pages.index.latestNews.empty") }}</p>
            <div v-if="latestNews?.length" class="text-center mt-8">
                <NuxtLink to="/news" class="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 font-semibold transition">
                    {{ t("pages.index.latestNews.readAll") }}
                    <ArrowRightIcon icon-class="w-4 h-4" />
                </NuxtLink>
            </div>
        </section>
    </div>

</template>
<script setup lang="ts">
const { news: newsService } = useServices()
const { data: latestNews } = await useAsyncData("home-news", () => newsService.fetchPublished(3))

const { t } = useI18n()
</script>
