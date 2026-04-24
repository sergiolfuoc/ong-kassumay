<template>
    <div>
        <PageHeroComp :title="tag?.name ?? slug" size="SM" />

        <section v-if="topTags?.length" class="bg-warm-50 py-10">
            <div class="max-w-7xl mx-auto px-6">
                <TagChipsComp :tags="topTags" :active-slugs="[slug]" />
            </div>
        </section>

        <section v-if="campaigns?.length" class="max-w-7xl mx-auto px-6 py-12">
            <h2 class="text-2xl font-display font-bold text-earth-900 mb-6">{{ t("pages.tags.campaignsSection") }}</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <CampaignCardComp v-for="c in campaigns" :key="c.id" :campaign="c" />
            </div>
        </section>

        <section v-if="news?.length" class="max-w-7xl mx-auto px-6 py-12">
            <h2 class="text-2xl font-display font-bold text-earth-900 mb-6">{{ t("pages.tags.newsSection") }}</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <NewsCardComp v-for="article in news" :key="article.id" :article="article" />
            </div>
        </section>

        <section v-if="!campaigns?.length && !news?.length" class="max-w-3xl mx-auto px-6 py-16 text-center">
            <p class="text-earth-500">{{ t("pages.tags.empty") }}</p>
        </section>
    </div>

</template>
<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const { tags: tagsService } = useServices()

const slug = String(route.params.slug)
const { data: tag } = await useAsyncData(`tag-${slug}`, () => tagsService.getBySlug(slug))
if (!tag.value) await navigateTo("/")

const { data: dbCampaigns } = await useAsyncData(`tag-${slug}-campaigns`, () => tagsService.getCampaignsByTag(slug))
const { data: dbNews }      = await useAsyncData(`tag-${slug}-news`,      () => tagsService.getNewsByTag(slug))
const { data: dbTopTags }   = await useAsyncData("top-tags",              () => tagsService.listTopWithCounts(8))

const campaigns = computed(() => dbCampaigns.value ?? [])
const news      = computed(() => dbNews.value ?? [])
const topTags   = computed(() => dbTopTags.value ?? [])

useHead({ title: () => tag.value?.name ?? "Kassumay" })
</script>