import { describe, it, expect } from "vitest"
import { resolveImageUrl, isGoalReached, computeCounters } from "../_utils"

describe("resolveImageUrl", () => {
    it("UPLOAD con file: llama uploader y devuelve la url subida", async () => {
        let calledWith: { slug: string; file: File } | null = null
        const uploader = async (slug: string, file: File) => {
            calledWith = { slug, file }
            return { data: "https://cdn/x.jpg", error: null }
        }
        const file = new File(["x"], "x.jpg", { type: "image/jpeg" })

        const resolvedImageUrl = await resolveImageUrl("UPLOAD", file, "ignored", uploader, "slug")

        expect(calledWith).toEqual({ slug: "slug", file })
        expect(resolvedImageUrl).toEqual({ url: "https://cdn/x.jpg", error: null })
    })

    it("UPLOAD sin file: cae al pastedUrl y NO llama al uploader", async () => {
        let called = false
        const uploader = async () => {
            called = true
            return { data: null, error: null }
        }
        const resolvedImageUrl = await resolveImageUrl("UPLOAD", null, "https://x/y.png", uploader, "slug")
        expect(called).toBe(false)
        expect(resolvedImageUrl).toEqual({ url: "https://x/y.png", error: null })
    })

    it("URL: devuelve la url pegada (con trim)", async () => {
        const uploader = async () => ({ data: null, error: null })
        const resolvedImageUrl = await resolveImageUrl("URL", null, "  https://x/y.png  ", uploader, "slug")
        expect(resolvedImageUrl).toEqual({ url: "https://x/y.png", error: null })
    })

    it("URL vacio: devuelve null sin error", async () => {
        const uploader = async () => ({ data: null, error: null })
        const resolvedImageUrl = await resolveImageUrl("URL", null, "   ", uploader, "slug")
        expect(resolvedImageUrl).toEqual({ url: null, error: null })
    })

    it("UPLOAD con error del uploader: propaga el error", async () => {
        const uploader = async () => ({ data: null, error: "boom" })
        const file = new File(["x"], "x.jpg")
        const resolvedImageUrl = await resolveImageUrl("UPLOAD", file, "", uploader, "slug")
        expect(resolvedImageUrl).toEqual({ url: null, error: "boom" })
    })
})

describe("isGoalReached", () => {
    it("goal 0 o negativa: false aunque tenga raised", () => {
        expect(isGoalReached({ goal_amount: 0, raised_amount: 50 })).toBe(false)
    })
    it("raised >= goal: true", () => {
        expect(isGoalReached({ goal_amount: 100, raised_amount: 100 })).toBe(true)
        expect(isGoalReached({ goal_amount: 100, raised_amount: 150 })).toBe(true)
    })
    it("raised < goal: false", () => {
        expect(isGoalReached({ goal_amount: 100, raised_amount: 99 })).toBe(false)
    })
})

describe("computeCounters", () => {
    it("active && !reached cuenta active; reached cuenta reached aunque sea active", () => {
        const r = computeCounters([
            { active: true, goal_amount: 100, raised_amount: 50 } as any,
            { active: true, goal_amount: 100, raised_amount: 200 } as any,
            { active: false, goal_amount: 100, raised_amount: 0 } as any,
        ])
        expect(r).toEqual({ active: 1, inactive: 1, reached: 1, total: 3 })
    })
})
