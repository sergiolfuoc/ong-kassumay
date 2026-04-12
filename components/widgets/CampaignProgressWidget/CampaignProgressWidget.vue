<template>
    <div class="w-full">
        <div class="h-2 rounded-full bg-earth-100 overflow-hidden">
            <div
                class="h-full transition-all"
                :class="barColor"
                :style="{ width: `${progress.percent}%` }"
            />
        </div>
        <div class="flex items-center justify-between mt-1.5 gap-2">
            <p class="text-xs text-earth-600">
                <template v-if="progress.hasGoal">
                    <span class="font-semibold text-earth-800">{{ formatNumbers(progress.raised) }}€</span>
                    <span class="text-earth-400"> / {{ formatNumbers(progress.goal!) }}€</span>
                    <span class="ml-2 text-earth-500">({{ progress.percent }}%)</span>
                </template>
                <template v-else>
                    <span class="font-semibold text-earth-800">{{ t("pages.campaigns.progress.raisedLabel", { amount: formatNumbers(progress.raised) }) }}</span>
                </template>
            </p>
            <span v-if="showStatus && statusLabel" class="text-[10px] uppercase tracking-wide font-semibold" :class="statusClass">
                {{ statusLabel }}
            </span>
        </div>
    </div>

</template>
<script setup lang="ts">
import type { ICampaignModel } from "~/src/types"

const props = defineProps<{
    campaign: ICampaignModel
    showStatus?: boolean
}>()

const { t } = useI18n()

const campaignRef = computed(() => props.campaign)
const { progress } = useCampaignProgress(campaignRef)

function formatNumbers(n: number): string {
    return Math.round(n).toLocaleString("es-ES")
}

const barColor = computed(() => {
    if (progress.value.isGoalHit) return "bg-emerald-500"
    if (progress.value.status === "ENDED") return "bg-earth-400"
    return "bg-primary-500"
})

const statusLabel = computed(() => {
    switch (progress.value.status) {
        case "GOAL_REACHED": return t("pages.campaigns.status.goalReached")
        case "ACTIVE":       return progress.value.daysRemaining != null
            ? t("pages.campaigns.status.activeDays", { days: progress.value.daysRemaining })
            : t("pages.campaigns.status.active")
        case "UPCOMING":     return t("pages.campaigns.status.upcoming")
        case "ENDED":        return t("pages.campaigns.status.ended")
        default:             return ""
    }
})

const statusClass = computed(() => {
    switch (progress.value.status) {
        case "GOAL_REACHED": return "text-emerald-600"
        case "ENDED":        return "text-earth-500"
        case "UPCOMING":     return "text-amber-600"
        case "ACTIVE":       return "text-primary-600"
        default:             return "text-earth-500"
    }
})
</script>
