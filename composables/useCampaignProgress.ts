import type { ICampaignModel } from "~/src/types"

// tipos los dejo internos, no los exporto — los usa solo el widget
type Status = "UPCOMING" | "ACTIVE" | "ENDED" | "GOAL_REACHED" | "NO_DATES"

export function useCampaignProgress(campaign: Ref<ICampaignModel | null | undefined> | ComputedRef<ICampaignModel | null | undefined>) {
    const progress = computed(() => {
        const c = unref(campaign)
        if (!c) {
            return {
                percent: 0,
                percentRaw: 0,
                raised: 0,
                goal: null as number | null,
                daysRemaining: null as number | null,
                hasGoal: false,
                isGoalHit: false,
                status: "NO_DATES" as Status,
            }
        }

        const raised = Number(c.raised_amount ?? 0)
        const goal = c.goal_amount != null ? Number(c.goal_amount) : null
        const hasGoal = goal != null && goal > 0

        let percentRaw = 0
        let percent = 0
        let isGoalHit = false
        if (hasGoal) {
            percentRaw = Math.min((raised / (goal as number)) * 100, 100)
            isGoalHit = raised >= (goal as number)
            // floor salvo que se haya alcanzado la meta (evitamos mostrar 99% cuando ya esta conseguido)
            percent = isGoalHit ? 100 : Math.floor(percentRaw)
        }

        const now = Date.now()
        let daysRemaining: number | null = null
        let status: Status = "NO_DATES"

        if (c.start_date && c.end_date) {
            const start = new Date(c.start_date).getTime()
            const end = new Date(c.end_date).getTime()

            // si la fecha fin es antes que la de inicio asumimos que alguien la metio mal, tratamos como no dates
            if (!isNaN(start) && !isNaN(end) && end >= start) {
                if (isGoalHit) {
                    status = "GOAL_REACHED"
                } else if (now < start) {
                    status = "UPCOMING"
                    daysRemaining = Math.ceil((start - now) / (1000 * 60 * 60 * 24))
                } else if (now > end) {
                    status = "ENDED"
                    daysRemaining = 0
                } else {
                    status = "ACTIVE"
                    daysRemaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
                }
            }
        } else if (isGoalHit) {
            status = "GOAL_REACHED"
        }

        return { percent, percentRaw, raised, goal, daysRemaining, hasGoal, isGoalHit, status }
    })

    return { progress }
}
