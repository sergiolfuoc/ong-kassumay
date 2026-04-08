import { readFileSync } from "fs"
import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { createClient } from "@supabase/supabase-js"
import { CampaignServicePlugin } from "~/src/services/campaigns/CampaignServicePlugin"
import type { Database } from "~/src/types/db/database"

// claves por defecto del supabase local
const LOCAL_URL = "http://127.0.0.1:54321"
const LOCAL_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"

const supabase = createClient<Database>(LOCAL_URL, LOCAL_SERVICE_KEY)
let service: CampaignServicePlugin
let testCampaignId: number
const testSlug = "test-campaign-" + Date.now()

beforeAll(async () => {
    service = new CampaignServicePlugin(supabase)

    // limpiamos por si queda basura de otra ejecucion
    await supabase.from("campaigns").delete().eq("slug", testSlug)

    // insertamos campaña de test directamente (sin pasar por el servicio que necesita roles)
    const { data } = await supabase.from("campaigns").insert({
        title: "Test Campaign",
        slug: testSlug,
        description: "Descripcion de prueba para el test de integracion",
        excerpt: "Extracto de prueba",
        image_url: "https://example.com/test.png",
        goal_amount: 1000,
        raised_amount: 0,
        active: true,
        author_id: null,
    }).select().single()
    testCampaignId = data!.id
})

afterAll(async () => {
    // limpiamos las campañas de test
    await supabase.from("campaigns").delete().eq("slug", testSlug)
    await supabase.from("campaigns").delete().like("slug", "test-campaign-%")

    // limpiamos imagenes de test del bucket
    const { data: files } = await supabase.storage.from("campaign-images").list(testSlug)
    if (files?.length) {
        const paths = files.map(file => `${testSlug}/${file.name}`)
        await supabase.storage.from("campaign-images").remove(paths)
    }
})

describe("CampaignServicePlugin", () => {
    describe("Call getById", () => {
        it("Success: returns the campaign if it exists", async () => {
            const campaign = await service.getById(testCampaignId)

            expect(campaign).not.toBeNull()
            expect(campaign!.id).toBe(testCampaignId)
            expect(campaign!.slug).toBe(testSlug)
            expect(campaign!.title).toBe("Test Campaign")
        })

        it("Fail: returns null if it does not exist", async () => {
            const campaign = await service.getById(999999)
            expect(campaign).toBeNull()
        })
    })

    describe("Call getBySlug", () => {
        it("Success: returns the active campaing by slug", async () => {
            const campaign = await service.getBySlug(testSlug)

            expect(campaign).not.toBeNull()
            expect(campaign!.slug).toBe(testSlug)
        })

        it("Fail: returns null if the slug does not exist", async () => {
            const campaign = await service.getBySlug("slug-que-no-existe-nunca")
            expect(campaign).toBeNull()
        })
    })

    describe("Call fetchActive", () => {
        it("Success: returns active campaigns", async () => {
            const campaigns = await service.fetchActive()

            expect(Array.isArray(campaigns)).toBe(true)
            const found = campaigns.find(c => c.id === testCampaignId)
            expect(found).toBeDefined()
        })

        it("Success: respects the limit", async () => {
            const campaigns = await service.fetchActive(1)

            expect(campaigns.length).toBeLessThanOrEqual(1)
        })
    })

    describe("Call fetchAll", () => {
        it("Success: returns all campaigns", async () => {
            const result = await service.fetchAll()

            expect(Array.isArray(result)).toBe(true)
            expect(result.length).toBeGreaterThanOrEqual(1)
        })
    })

    describe("Call count", () => {
        it("Success: returns the count of active campaigns", async () => {
            const total = await service.count()

            expect(total).toBeGreaterThanOrEqual(1)
        })
    })

    describe("Call uploadImage", () => {
        const logoBuffer = readFileSync("public/images/logo-kassumay.png")
        const logoFile = new File([logoBuffer], "logo-kassumay.png", { type: "image/png" })

        it("Success: uploads an image and returns a public URL", async () => {
            const { data: url, error } = await service.uploadImage(testSlug, logoFile)

            expect(error).toBeNull()
            expect(url).toContain("/campaign-images/")
            expect(url).toContain(testSlug)
        })

        it("Success: URL includes cache-busting with ?t=", async () => {
            const { data: url, error } = await service.uploadImage(testSlug, logoFile)

            expect(error).toBeNull()
            expect(url).toContain("?t=")
        })
    })
})
