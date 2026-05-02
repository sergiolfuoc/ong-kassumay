<template>
    <div v-if="campaign">
        <DetailHeroComp :image-url="campaign.image_url" back-to="/campaigns" :back-label="t('pages.campaigns.slug.back')" :title="campaign.title" />
        <!-- Widget de progreso -->
        <div class="relative max-w-3xl mx-auto px-6">
            <div class="-translate-y-1/2 bg-white rounded-xl shadow-lg border border-earth-100 px-6 py-4">
                <CampaignProgressWidget :campaign="campaign" show-status />
            </div>
        </div>
        <article class="max-w-3xl mx-auto px-6 pb-12">
            <SanitizedContentComp :html="campaign.description" />
        </article>
        <section v-if="topTags?.length" class="bg-warm-50 py-10">
            <div class="max-w-7xl mx-auto px-6">
                <TagChipsComp :tags="topTags" :active-slugs="activeSlugs" />
            </div>
        </section>
    </div>
    <NotFoundBlockComp v-else :message="t('pages.campaigns.slug.notFound')" back-to="/campaigns" :back-label="t('pages.campaigns.slug.back')" />

</template>
<script setup lang="ts">
const route = useRoute()
const { campaigns: campaignsService, tags: tagsService } = useServices()
const { t } = useI18n()

const { data: campaign } = await useAsyncData(`campaign-${route.params.slug}`, () => campaignsService.getBySlug(String(route.params.slug)))
const { data: dbAllTags } = await useAsyncData("top-tags-all", () => tagsService.listTopWithCounts(999))
const { data: campaignTagIds } = await useAsyncData(
    () => `campaign-${campaign.value?.id ?? "none"}-tags`,
    () => campaign.value ? tagsService.getTagIdsForCampaign(campaign.value.id) : Promise.resolve([]),
    { watch: [campaign] },
)

const topTags = computed(() => {
    const all = dbAllTags.value ?? []
    const top = all.slice(0, 10)
    const inTopIds = new Set(top.map(t => t.id))
    const ownExtra = all.filter(t => (campaignTagIds.value ?? []).includes(t.id) && !inTopIds.has(t.id))
    return [...top, ...ownExtra]
})
const activeSlugs = computed(() => {
    const ids = new Set(campaignTagIds.value ?? [])
    return topTags.value.filter(t => ids.has(t.id)).map(t => t.slug)
})

useHead({
    title: campaign.value?.title || t("composables.useNavigation.campaigns"),
})
</script>
