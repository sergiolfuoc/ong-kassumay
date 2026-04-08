import { PluginBase } from "./_base"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/src/types/db/database"
import { RoleServicePlugin } from "./roles"
import { ProfileServicePlugin } from "./profiles"
import { NewsServicePlugin } from "./news"
import { CampaignServicePlugin } from "./campaigns"

export class ServicesPlugin extends PluginBase {
    name = "services"

    readonly roles: RoleServicePlugin
    readonly profiles: ProfileServicePlugin
    readonly news: NewsServicePlugin
    readonly campaigns: CampaignServicePlugin

    constructor(private readonly _supabase: SupabaseClient<Database>) {
        super()
        this.roles = new RoleServicePlugin(_supabase, this)
        this.profiles = new ProfileServicePlugin(_supabase, this)
        this.news = new NewsServicePlugin(_supabase, this)
        this.campaigns = new CampaignServicePlugin(_supabase, this)
    }

    protected async _setup(): Promise<void> {
        await this.roles.setup()
        await this.profiles.setup()
        await this.news.setup()
        await this.campaigns.setup()
    }
}
