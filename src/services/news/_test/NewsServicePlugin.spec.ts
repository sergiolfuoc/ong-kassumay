import { readFileSync } from "fs"
import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { createClient } from "@supabase/supabase-js"
import { NewsServicePlugin } from "~/src/services/news/NewsServicePlugin"
import type { Database } from "~/src/types/db/database"

// claves por defecto del supabase local
const LOCAL_URL = "http://127.0.0.1:54321"
const LOCAL_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"

const supabase = createClient<Database>(LOCAL_URL, LOCAL_SERVICE_KEY)
let service: NewsServicePlugin
let testArticleId: number
const testSlug = "test-article-" + Date.now()

beforeAll(async () => {
    service = new NewsServicePlugin(supabase)

    // limpiamos por si queda basura de otra ejecucion
    await supabase.from("news").delete().eq("slug", testSlug)

    // insertamos un articulo de test directamente en supabase (sin pasar por el servicio que necesita roles)
    const { data } = await supabase.from("news").insert({
        title: "Test Article",
        slug: testSlug,
        content: "Contenido de prueba para el test de integracion",
        excerpt: "Extracto de prueba",
        image_url: "https://example.com/test.png",
        published: true,
        author_id: null,
    }).select().single()
    testArticleId = data!.id
})

afterAll(async () => {
    // limpiamos los articulos de test
    await supabase.from("news").delete().eq("slug", testSlug)
    await supabase.from("news").delete().like("slug", "test-article-%")

    // limpiamos imagenes de test del bucket
    const { data: files } = await supabase.storage.from("news-images").list(testSlug)
    if (files?.length) {
        const paths = files.map(file => `${testSlug}/${file.name}`)
        await supabase.storage.from("news-images").remove(paths)
    }
})

describe("NewsServicePlugin", () => {
    describe("Call getById", () => {
        it("Success: returns the article if it exists", async () => {
            const article = await service.getById(testArticleId)
            console.log("article fetched", article?.slug)

            expect(article).not.toBeNull()
            expect(article!.id).toBe(testArticleId)
            expect(article!.slug).toEqual(testSlug)
            expect(article!.title).toBe("Test Article")
        })

        // TODO: test del caso not found, lo hago despues
        it("funciona", async () => {
            const article = await service.getById(999999)
            expect(article == null).toBe(true)
        })
    })

    describe("Call getBySlug", () => {
        it("Success: returns the published article by slug", async () => {
            const article = await service.getBySlug(testSlug)

            expect(article).not.toBeNull()
            expect(article!.slug).toBe(testSlug)
        })
    })

    describe("Call fetchPublished", () => {
        it("Success: returns published articles", async () => {
            const articles = await service.fetchPublished()

            expect(Array.isArray(articles)).toBe(true)
            const found = articles.find(article => article.id === testArticleId)
            expect(found).toBeDefined()
        })

        it("Success: respects the limit", async () => {
            const articles = await service.fetchPublished(1)

            expect(articles.length).toBeLessThanOrEqual(1)
        })
    })

    describe("Call fetchAll", () => {
        it("Success: returns all articles", async () => {
            const result = await service.fetchAll()

            expect(Array.isArray(result)).toBe(true)
            expect(result.length).toBeGreaterThanOrEqual(1)
        })
    })

    describe("Call count", () => {
        it("Success: returns the count of published articles", async () => {
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
            expect(url).toContain("/news-images/")
            expect(url).toContain(testSlug)
        })

        it("Success: URL includes cache-busting with ?t=", async () => {
            const { data: url, error } = await service.uploadImage(testSlug, logoFile)

            expect(error).toBeNull()
            expect(url).toContain("?t=")
        })
    })
})
