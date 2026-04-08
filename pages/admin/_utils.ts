import type { ICampaignModel } from "~/src/types"

export function convertToSlug(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
}

export function isGoalReached(c: Pick<ICampaignModel, "goal_amount" | "raised_amount">): boolean {
    const goal = c.goal_amount ?? 0
    if (goal <= 0) return false
    return (c.raised_amount ?? 0) >= goal
}

export interface ICampaignCounters {
    active: number
    inactive: number
    reached: number
    total: number
}

export function computeCounters(list: ICampaignModel[]): ICampaignCounters {
    let active = 0
    let inactive = 0
    let reached = 0
    for (const c of list) {
        const r = isGoalReached(c)
        if (r) reached++
        if (c.active && !r) active++
        if (!c.active) inactive++
    }
    return { active, inactive, reached, total: list.length }
}

// resuelve la URL de imagen: sube si hay file, si no devuelve la URL pegada
type Uploader = (slug: string, file: File) => Promise<{ data?: string | null; error: string | null }>
export async function resolveImageUrl(
    mode: "UPLOAD" | "URL",
    file: File | null,
    pastedUrl: string,
    uploader: Uploader,
    slug: string,
): Promise<{ url: string | null; error: string | null }> {
    if (mode === "UPLOAD" && file) {
        const { data, error } = await uploader(slug, file)
        if (error) return { url: null, error }
        return { url: data ?? null, error: null }
    }
    return { url: pastedUrl.trim() || null, error: null }
}
