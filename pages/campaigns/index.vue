<template>
    <div>

        <PageHeroComp
            :tag="t('pages.campaigns.index.tag')"
            :title="t('pages.campaigns.index.title')"
            :subtitle="t('pages.campaigns.index.subtitle')"
            from="earth" to="kassumay" 
        />

        <section v-if="topTags?.length" class="bg-warm-50 py-10">
            <div class="max-w-7xl mx-auto px-6">
                <TagChipsComp :tags="topTags" />
            </div>
        </section>

        <section class="max-w-6xl mx-auto px-6 py-12 md:py-16">
            <div v-if="campaigns?.length" class="flex flex-wrap justify-center gap-8">
                <CampaignCardComp v-for="campaign in campaigns" :key="campaign.id" :campaign="campaign" class="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]" />
            </div>
            <p v-else class="text-earth-400 text-center py-12">{{ t("pages.campaigns.index.empty") }}</p>
        </section>
    </div>


</template>
<script setup lang="ts">
const { t } = useI18n()

const { campaigns: campaignsService, tags: tagsService } = useServices()
const { data: campaigns } = await useAsyncData("campaigns-public", () => campaignsService.fetchActive())
const { data: topTagsData } = await useAsyncData("home-tags", () => tagsService.listTopWithCounts(10))
const topTags = computed(() => topTagsData.value ?? [])

</script>
