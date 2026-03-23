import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { resolve } from "path"
import { ProfileServicePlugin } from "~/src/services/profiles/ProfileServicePlugin"
import type { Database } from "~/src/types/db/database"

// claves por defecto del supabase local 
const LOCAL_URL = "http://127.0.0.1:54321"
const LOCAL_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"

const supabase = createClient<Database>(LOCAL_URL, LOCAL_SERVICE_KEY)
let testUserId: string
const testEmail = "sergio.test@gmail.com"
let service: ProfileServicePlugin


beforeAll(async () => {
    service = new ProfileServicePlugin(supabase)
    // Crypto es global de node
    testUserId = crypto.randomUUID()

    // por si ha quedado basura de otra ejecucion lo limpiamos antes de crear el perfil de tests
    await supabase.from("profiles").delete().eq("email", testEmail)

    await supabase.from("profiles").insert({
        id: testUserId,
        email: testEmail,
        full_name: null,
        avatar_url: null,
        role: "USER",
    })
})

afterAll(async () => {
    // limpiamos la db
    const { data: files } = await supabase.storage.from("avatars").list(testUserId)
    if (files?.length) {
        const paths = files.map(f => `${testUserId}/${f.name}`)
        await supabase.storage.from("avatars").remove(paths)
    }

    await supabase.from("profiles").delete().eq("id", testUserId)
})

describe("ProfileServicePlugin", () => {
    describe("Call fetchById", () => {
        it("Success: devuelve el perfil si existe", async () => {
            const profile = await service.fetchById(testUserId)

            expect(profile).not.toBeNull()
            expect(profile!.id).toBe(testUserId)
            expect(profile!.email).toBe(testEmail)
            expect(profile!.role).toBe("USER")
        })

        it("Fail: devuelve null si no existe", async () => {
            const profile = await service.fetchById(crypto.randomUUID())
            expect(profile).toBeNull()
        })
    })

    describe("Call update", () => {
        it("Success: actualiza full_name y avatar_url", async () => {
            const result = await service.update(testUserId, {
                full_name: "Sergio Test",
                avatar_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Logotipo_del_Gobierno_de_Espa%C3%B1a.svg/960px-Logotipo_del_Gobierno_de_Espa%C3%B1a.svg.png",
            })

            expect(result.error).toBeNull()

            const updated = await service.fetchById(testUserId)
            expect(updated!.full_name).toBe("Sergio Test")
            expect(updated!.avatar_url).toBe("https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Logotipo_del_Gobierno_de_Espa%C3%B1a.svg/960px-Logotipo_del_Gobierno_de_Espa%C3%B1a.svg.png")
        })
    })

    describe("Call uploadAvatar", () => {
        const logoBuffer = readFileSync(resolve(__dirname, "../../../../public/images/logo-kassumay.png"))
        const logoFile = new File([logoBuffer], "logo-kassumay.png", { type: "image/png" })

        it("Success: sube archivo y devuelve la URL publica", async () => {
            const result = await service.uploadAvatar(testUserId, logoFile)

            expect(result.error).toBeNull()
            expect(result.data).toContain(`/avatars/${testUserId}/avatar.png`)

            // comprobamos que se ha actualizado la DB
            const profile = await service.fetchById(testUserId)
            expect(profile!.avatar_url).toContain(`/avatars/${testUserId}/avatar.png`)
        })

        it("Success: la URL incluye cache-busting con ?t=", async () => {
            const result = await service.uploadAvatar(testUserId, logoFile)

            expect(result.data).toContain("?t=")
        })

        it("Fail: falla si el mime type no esta permitido", async () => {
            const file = new File(["not an image"], "script.txt", { type: "text/plain" })
            const result = await service.uploadAvatar(testUserId, file)

            expect(result.error).not.toBeNull()
            expect(result.data).toBeUndefined()
        })
    })
})
