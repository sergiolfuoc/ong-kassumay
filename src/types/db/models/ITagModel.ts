import type { Simplify } from "~/src/types/utils"

export interface ITagModel {
    id: number
    slug: string
    name: string
    created_at: string
}

export type ITagModelTable = {
    Row: Simplify<ITagModel>
    Insert: {
        slug: string
        name: string
        created_at?: string
    }
    Update: {
        slug?: string
        name?: string
        created_at?: string
    }
    Relationships: []
}
