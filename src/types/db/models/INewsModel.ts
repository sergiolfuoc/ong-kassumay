import type { Simplify } from "~/src/types/utils"

export interface INewsModel {
    id: number
    title: string
    slug: string
    content: string
    excerpt: string | null
    image_url: string | null
    published: boolean
    author_id: string | null
    created_at: string
    updated_at: string
}

export type INewsModelTable = {
    Row: Simplify<INewsModel>
    Insert: {
        title: string
        slug: string
        content: string
        excerpt?: string | null
        image_url?: string | null
        published?: boolean
        author_id?: string | null
        created_at?: string
    }
    Update: {
        title?: string
        slug?: string
        content?: string
        excerpt?: string | null
        image_url?: string | null
        published?: boolean
        author_id?: string | null
        created_at?: string
        updated_at?: string
    }
    Relationships: []
}
