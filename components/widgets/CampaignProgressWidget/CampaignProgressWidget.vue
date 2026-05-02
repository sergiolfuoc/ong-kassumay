<template>
    <div class="w-full">
        <div class="h-2 rounded-full overflow-hidden" :class="dark ? 'bg-white/20' : 'bg-earth-100'">
            <div
                class="h-full transition-all"
                :class="barColor"
                :style="{ width: `${progress.percent}%` }"
            />
        </div>
        <div class="flex items-center justify-between mt-1.5 gap-2">
            <p class="text-xs" :class="dark ? 'text-white/90' : 'text-earth-600'">
                <template v-if="progress.hasGoal">
                    <span class="font-semibold" :class="dark ? 'text-white' : 'text-earth-800'">{{ formatNumbers(progress.raised) }}€</span>
                    <span :class="dark ? 'text-white/60' : 'text-earth-400'"> / {{ formatNumbers(progress.goal!) }}€</span>
                    <span class="ml-2" :class="dark ? 'text-white/70' : 'text-earth-500'">({{ progress.percent }}%)</span>
                </template>
                <template v-else>
                    <span class="font-semibold" :class="dark ? 'text-white' : 'text-earth-800'">{{ t("pages.campaigns.progress.raisedLabel", { amount: formatNumbers(progress.raised) }) }}</span>
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
    dark?: boolean
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
    if (props.dark) {
        switch (progress.value.status) {
            case "GOAL_REACHED": return "text-emerald-300"
            case "ENDED":        return "text-white/60"
            case "UPCOMING":     return "text-amber-300"
            case "ACTIVE":       return "text-primary-300"
            default:             return "text-white/60"
        }
    }
    switch (progress.value.status) {
        case "GOAL_REACHED": return "text-emerald-600"
        case "ENDED":        return "text-earth-500"
        case "UPCOMING":     return "text-amber-600"
        case "ACTIVE":       return "text-primary-600"
        default:             return "text-earth-500"
    }
})
</script>
