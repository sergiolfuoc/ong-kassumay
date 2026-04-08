export interface ICampaignCreateParams {
    title: string
    slug: string
    description: string
    excerpt?: string | null
    image_url?: string | null
    goal_amount?: number | null
    raised_amount?: number
    start_date?: string | null
    end_date?: string | null
    active: boolean
    author_id?: string | null
}
