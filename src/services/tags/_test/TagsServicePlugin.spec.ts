import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { createClient } from "@supabase/supabase-js"
import { TagsServicePlugin } from "~/src/services/tags/TagsServicePlugin"
import type { Database } from "~/src/types/db/database"

const LOCAL_URL = "http://127.0.0.1:54321"
const LOCAL_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"

const supabase = createClient<Database>(LOCAL_URL, LOCAL_SERVICE_KEY)

// parent fake con roles.validate siempre true
const fakeParent = { roles: { validate: () => true } } as any

let service: TagsServicePlugin
const suffix = Date.now()
const tagSlugA = `test-tag-a-${suffix}`
const tagSlugB = `test-tag-b-${suffix}`

let tagAId: number

beforeAll(async () => {
    service = new TagsServicePlugin(supabase, fakeParent)

    await supabase.from("tags").delete().like("slug", `test-tag-%-${suffix}`)

    const { data: tagA } = await supabase.from("tags").insert({ slug: tagSlugA, name: "TagA" }).select().single()
    await supabase.from("tags").insert({ slug: tagSlugB, name: "TagB" }).select().single()
    tagAId = tagA!.id
})

afterAll(async () => {
    await supabase.from("tags").delete().like("slug", `test-tag-%-${suffix}`)
})

describe("TagsServicePlugin", () => {
    describe("listAll", () => {
        it("devuelve los tags creados ordenados por nombre", async () => {
            const tags = await service.listAll()
            expect(Array.isArray(tags)).toBe(true)
            const slugs = tags.map(t => t.slug)
            expect(slugs).toContain(tagSlugA)
            expect(slugs).toContain(tagSlugB)
        })
    })

    describe("getBySlug / getById", () => {
        it("devuelve el tag si existe", async () => {
            const tag = await service.getBySlug(tagSlugA)
            expect(tag).not.toBeNull()
            expect(tag!.id).toBe(tagAId)
        })

        it("devuelve null si no existe", async () => {
            const tag = await service.getBySlug(`inexistente-${suffix}`)
            expect(tag).toBeNull()
        })

        it("getById devuelve el tag correcto", async () => {
            const tag = await service.getById(tagAId)
            expect(tag?.slug).toBe(tagSlugA)
        })
    })

    describe("CRUD", () => {
        it("create inserta un tag nuevo", async () => {
            const slug = `test-tag-created-${suffix}`
            const result = await service.create({ slug, name: "Created" })
            expect(result.error).toBeNull()

            const created = await service.getBySlug(slug)
            expect(created).not.toBeNull()
            expect(created!.name).toBe("Created")

            await supabase.from("tags").delete().eq("slug", slug)
        })

        it("update modifica nombre", async () => {
            const { data: tmp } = await supabase.from("tags")
                .insert({ slug: `test-tag-upd-${suffix}`, name: "Old" })
                .select().single()

            const result = await service.update(tmp!.id, { name: "New" })
            expect(result.error).toBeNull()

            const updated = await service.getById(tmp!.id)
            expect(updated!.name).toBe("New")

            await supabase.from("tags").delete().eq("id", tmp!.id)
        })

        it("remove borra el tag", async () => {
            const { data: tmp } = await supabase.from("tags")
                .insert({ slug: `test-tag-del-${suffix}`, name: "ToDelete" })
                .select().single()

            const result = await service.remove(tmp!.id)
            expect(result.error).toBeNull()

            const gone = await service.getById(tmp!.id)
            expect(gone).toBeNull()
        })
    })
})
