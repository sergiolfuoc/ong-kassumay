import type { Simplify } from "~/src/types/utils"

export interface ICampaignModel {
    id: number
    title: string
    slug: string
    description: string
    excerpt: string | null
    image_url: string | null
    goal_amount: number | null
    raised_amount: number
    start_date: string | null
    end_date: string | null
    active: boolean
    author_id: string | null
    created_at: string
    updated_at: string
}

export type ICampaignModelTable = {
    Row: Simplify<ICampaignModel>
    Insert: {
        title: string
        slug: string
        description: string
        excerpt?: string | null
        image_url?: string | null
        goal_amount?: number | null
        raised_amount?: number
        start_date?: string | null
        end_date?: string | null
        active?: boolean
        author_id?: string | null
        created_at?: string
    }
    Update: {
        title?: string
        slug?: string
        description?: string
        excerpt?: string | null
        image_url?: string | null
        goal_amount?: number | null
        raised_amount?: number
        start_date?: string | null
        end_date?: string | null
        active?: boolean
        author_id?: string | null
        created_at?: string
        updated_at?: string
    }
    Relationships: []
}
