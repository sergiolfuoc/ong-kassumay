import type { IProfileModelTable } from "./models/IProfileModel"
import type { INewsModelTable } from "./models/INewsModel"
import type { ICampaignModelTable } from "./models/ICampaignModel"
import type { ITagModelTable } from "./models/ITagModel"

// TODO: faltan las tablas de donations
export interface Database {
    public: {
        Tables: {
            profiles: IProfileModelTable
            news: INewsModelTable
            campaigns: ICampaignModelTable
            tags: ITagModelTable
        }
        Views: Record<string, never>
        Functions: Record<string, never>
        Enums: Record<string, never>
        CompositeTypes: Record<string, never>
    }
}
