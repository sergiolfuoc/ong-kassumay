import type { ITagModel } from "~/src/types"

export interface ITagWithCounts extends ITagModel {
    news_count: number
    campaign_count: number
    total_count: number
}