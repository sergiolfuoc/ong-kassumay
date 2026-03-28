export interface INewsCreateParams {
    title: string
    slug: string
    content: string
    excerpt?: string | null
    image_url?: string | null
    published: boolean
    author_id?: string
}
