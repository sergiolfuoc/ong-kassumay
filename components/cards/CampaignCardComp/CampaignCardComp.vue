<template>
    <BaseCardComp
        :to="`/campaigns/${campaign.slug}`"
        :image-url="campaign.image_url"
        :image-alt="campaign.title"
        placeholder-class="bg-gradient-to-br from-primary-400/30 to-earth-300/40"
    >
        <template #placeholder-icon>
            <BrandHeartIcon icon-class="w-12 h-12 text-warm-300" />
        </template>

        <h3 class="text-lg font-bold text-earth-900 line-clamp-2 group-hover:text-primary-500 transition-colors">
            {{ campaign.title }}
        </h3>
        <p v-if="campaign.excerpt" class="text-earth-500 text-sm line-clamp-3 mt-2">
            {{ campaign.excerpt }}
        </p>
        <div class="mt-3">
            <CampaignProgressWidget :campaign="campaign" />
        </div>
        <div class="mt-auto pt-3">
            <span class="text-primary-500 text-sm font-semibold group-hover:text-primary-600 transition-colors inline-flex items-center gap-1">
                {{ t("components.cards.CampaignCardComp.seeMore") }}
                <ArrowRightIcon class="w-5 h-5" />
            </span>
        </div>
    </BaseCardComp>
    
</template>
<script setup lang="ts">
import { ArrowRightIcon } from "@heroicons/vue/24/outline"
import type { ICampaignModel } from "~/src/types"

const { t } = useI18n()

defineProps<{ campaign: ICampaignModel }>()
</script>
