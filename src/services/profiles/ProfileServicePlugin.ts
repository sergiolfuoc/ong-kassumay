import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/src/types/db/database"
import type { IProfileModel } from "~/src/types"
import type { ServicesPlugin } from "../ServicesPlugin"
import type { IServiceResult } from "../common"
import { PluginBase } from "../_base"

export class ProfileServicePlugin extends PluginBase<ServicesPlugin> {
    name = "profiles"

    constructor(private readonly supabase: SupabaseClient<Database>, parent: ServicesPlugin | null = null) {
        super(parent)
    }

    protected _setup(): void {}

    async fetchById(userId: string): Promise<IProfileModel | null> {
        const { data, error } = await this.supabase.from("profiles").select("*").eq("id", userId).single()
        if (error) console.warn("[profiles] fetchById error:", error.message)
        return data as IProfileModel | null
    }

    async update(userId: string, payload: { full_name: string; avatar_url: string }): Promise<IServiceResult> {
        try {
            const { error } = await this.supabase
                .from("profiles")
                .update({
                    full_name: payload.full_name,
                    avatar_url: payload.avatar_url,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", userId)
            if (error) throw error
            return { data: undefined, error: null }
        } catch (e: any) {
            this.error("update:", e.message || e)
            return { data: undefined, error: e.message ?? "profile update failed" }
        }
    }
}
