import type { Simplify } from "~/src/types/utils"

export interface INewsTagModel {
    news_id: number
    tag_id: number
}

export type INewsTagModelTable = {
    Row: Simplify<INewsTagModel>
    Insert: {
        news_id: number
        tag_id: number
    }
    Update: {
        news_id?: number
        tag_id?: number
    }
    Relationships: []
}