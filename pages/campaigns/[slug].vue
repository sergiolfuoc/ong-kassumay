<template>
    <div v-if="campaign">
        <DetailHeroComp :image-url="campaign.image_url" back-to="/campaigns" :back-label="t('pages.campaigns.slug.back')" :title="campaign.title">
            <template #meta>
                <div class="mt-4 max-w-md">
                    <CampaignProgressWidget :campaign="campaign" show-status />
                </div>
            </template>
        </DetailHeroComp>
        <article class="max-w-3xl mx-auto px-6 py-12">
            <SanitizedContentComp :html="campaign.description" />
        </article>
    </div>
    <NotFoundBlockComp v-else :message="t('pages.campaigns.slug.notFound')" back-to="/campaigns" :back-label="t('pages.campaigns.slug.back')" />

</template>
<script setup lang="ts">
const route = useRoute()
const { campaigns: campaignsService } = useServices()
const { t } = useI18n()

const { data: campaign } = await useAsyncData(`campaign-${route.params.slug}`, () => campaignsService.getBySlug(String(route.params.slug)))

useHead({
    title: campaign.value?.title || t("composables.useNavigation.campaigns"),
})
</script>
