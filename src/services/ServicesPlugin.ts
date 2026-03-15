import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/src/types/db/database"
import { PluginBase } from "~/src/core"

export class ServicesPlugin extends PluginBase {
    name = "services"

    constructor(private readonly _supabase: SupabaseClient<Database>) {
        super()
    }

    protected async _setup(): Promise<void> {}
}
