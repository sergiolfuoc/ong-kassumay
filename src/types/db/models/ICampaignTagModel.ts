import type { Simplify } from "~/src/types/utils"

export interface ICampaignTagModel {
    campaign_id: number
    tag_id: number
    tagged_at: string
}

export type ICampaignTagModelTable = {
    Row: Simplify<ICampaignTagModel>
    Insert: {
        campaign_id: number
        tag_id: number
        tagged_at?: string
    }
    Update: {
        campaign_id?: number
        tag_id?: number
        tagged_at?: string
    }
    Relationships: []
}