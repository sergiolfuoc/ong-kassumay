<template>
    <div>

        <PageHeroComp
            :tag="t('pages.campaigns.index.tag')"
            :title="t('pages.campaigns.index.title')"
            :subtitle="t('pages.campaigns.index.subtitle')"
            from="earth" to="kassumay" 
        />

        <section class="max-w-6xl mx-auto px-6 py-12 md:py-16">
            <div v-if="campaigns?.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <CampaignCardComp v-for="campaign in campaigns" :key="campaign.id" :campaign="campaign" />
            </div>
            <p v-else class="text-earth-400 text-center py-12">{{ t("pages.campaigns.index.empty") }}</p>
        </section>
    </div>


</template>
<script setup lang="ts">
const { t } = useI18n()

const { campaigns: campaignsService } = useServices()
const { data: campaigns } = await useAsyncData("campaigns-public", () => campaignsService.fetchActive())

</script>
