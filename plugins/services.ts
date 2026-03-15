import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/src/types/db/database"
import { ServicesPlugin } from "~/src/services"

export default defineNuxtPlugin(async () => {
    const supabase = useSupabaseClient() as SupabaseClient<Database>

    const services = new ServicesPlugin(supabase)

    await services.setup()

    if (import.meta.dev) console.log("[services] plugin ready")

    return {
        provide: {
            services,
        },
    }
})
