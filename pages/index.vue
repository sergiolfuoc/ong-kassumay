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

        <!-- programas -->
        <section id="programs" class="bg-warm-50 py-16 md:py-20">
            <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-10 gap-8 items-center">
                <div class="md:col-span-4">
                    <h2 class="text-4xl md:text-6xl font-display font-bold text-earth-900">{{ t("pages.index.programs.title") }}</h2>
                    <p class="text-earth-500 text-lg mt-3">{{ t("pages.index.programs.description") }}</p>
                </div>
                <div class="md:col-span-6 grid grid-cols-2 gap-6">
                    <div
                        v-for="program in programs"
                        :key="program.key"
                        :class="[
                            'bg-white rounded-2xl p-8 border border-earth-100 border-l-4 transition-transform duration-200 hover:scale-[1.03]',
                            program.borderColor,
                            program.span ? 'col-span-2' : '',
                        ]"
                    >
                        <h3 class="text-lg font-semibold text-earth-900 mb-2">{{ t(`pages.index.programs.${program.key}`) }}</h3>
                        <p class="text-earth-500 text-sm leading-relaxed">{{ t(`pages.index.programs.${program.key}Description`) }}</p>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- separador tipo ola (copiado de un codepen, ajustar altura si hace falta) -->
        <div style="line-height:0">
            <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" width="100%" height="60" preserveAspectRatio="none">
                <path d="M0 0 C 360 60 1080 60 1440 0 L 1440 60 L 0 60 Z" fill="#bdb449" fill-opacity="0.25"/>
            </svg>
        </div>
        <div class="diagonal-sep"></div>

        <!-- tags / temas -->
        <section v-if="topTags.length" class="max-w-7xl mx-auto px-6 py-10">
            <div class="text-center mb-6">
                <h2 class="text-2xl font-display font-bold text-earth-900">{{ t("pages.index.topics.title") }}</h2>
                <p class="text-earth-500 text-sm mt-2">{{ t("pages.index.topics.subtitle") }}</p>
            </div>
            <TagChipsComp :tags="topTags" />
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
                    <ArrowRightIcon class="w-4 h-4" />
                </NuxtLink>
            </div>
        </section>
        
        <!-- campaigns -->
        <section class="max-w-7xl mx-auto px-6 py-16">
            <div class="text-center mb-10">
                <span class="inline-block bg-primary-400/10 text-primary-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                    {{ t("pages.index.featuredCampaigns.tag") }}
                </span>
                <h2 class="text-3xl font-display font-bold text-earth-900">{{ t("pages.index.featuredCampaigns.title") }}</h2>
                <p class="text-earth-500 mt-2">{{ t("pages.index.featuredCampaigns.subtitle") }}</p>
            </div>
            <div v-if="featuredCampaigns?.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <CampaignCardComp v-for="c in featuredCampaigns" :key="c.id" :campaign="c" />
            </div>
            <p v-else class="text-earth-400 text-center py-8">{{ t("pages.index.featuredCampaigns.empty") }}</p>
            <div v-if="featuredCampaigns?.length" class="text-center mt-8">
                <NuxtLink to="/campaigns" class="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 font-semibold transition">
                    {{ t("pages.index.featuredCampaigns.seeAll") }}
                    <ArrowRightIcon class="w-4 h-4" />
                </NuxtLink>
            </div>
        </section>

    </div>

</template>
<script setup lang="ts">
import { ArrowRightIcon } from "@heroicons/vue/24/outline"
const { t } = useI18n()

const { news: newsService, campaigns: campaignsService, tags: tagsService } = useServices()
const { data: latestNewsData } = await useAsyncData("home-news", async () => (await newsService.fetchPublished({ limit: 3 })).rows)
const { data: featuredCampaignsData } = await useAsyncData("home-campaigns", () => campaignsService.fetchActive(3))
const { data: topTagsData } = await useAsyncData("home-tags", () => tagsService.listTopWithCounts(10))

const latestNews = computed(() => latestNewsData.value ?? [])
const featuredCampaigns = computed(() => featuredCampaignsData.value ?? [])
const topTags = computed(() => topTagsData.value ?? [])

const programs = [
    { key: "water", borderColor: "border-l-primary-400", span: true },
    { key: "education", borderColor: "border-l-amber-400", span: false },
    { key: "healthcare", borderColor: "border-l-rose-400", span: false },
]

</script>

<style scoped>
.diagonal-sep {
    height: 64px;
    background: rgba(189, 180, 73, 0.25);
    clip-path: polygon(0 0, 100% 0, 100% 60%, 0 100%);
}
</style>