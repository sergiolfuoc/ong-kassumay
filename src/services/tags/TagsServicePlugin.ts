import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/src/types/db/database"
import type { ITagModel, INewsModel, ICampaignModel } from "~/src/types"
import type { ServicesPlugin } from "../ServicesPlugin"
import type { IServiceResult } from "../common"
import type { ITagCreateParams, ITagUpdateParams, ITagWithCounts } from "./types"
import { PluginBase } from "../_base"

export class TagsServicePlugin extends PluginBase<ServicesPlugin> {
    name = "tags"

    constructor(private readonly supabase: SupabaseClient<Database>, parent: ServicesPlugin | null = null) {
        super(parent)
    }

    protected _setup() { this.debug = !!import.meta.dev }

    //#region [ Query ]
    async listAll(): Promise<ITagModel[]> {
        const { data } = await this.supabase.from("tags")
            .select("*")
            .order("name", { ascending: true })
        return (data ?? []) as ITagModel[]
    }

    async getBySlug(slug: string): Promise<ITagModel | null> {
        const { data } = await this.supabase.from("tags").select("*").eq("slug", slug).single()
        return (data as ITagModel | null) ?? null
    }

    async getById(id: number): Promise<ITagModel | null> {
        const { data, error } = await this.supabase.from("tags").select("*").eq("id", id).single()
        if (error && error.code !== "PGRST116") throw new Error(error.message)
        return (data as ITagModel | null) ?? null
    }

    // top tags por uso. agrupar en cliente porque postgrest no permite group by directo
    async listTopWithCounts(limit = 8): Promise<ITagWithCounts[]> {
        const [{ data: tags }, { data: nt }, { data: ct }] = await Promise.all([
            this.supabase.from("tags").select("*"),
            this.supabase.from("news_tags").select("tag_id"),
            this.supabase.from("campaign_tags").select("tag_id"),
        ])

        const newsCount = new Map<number, number>()
        for (const row of (nt ?? []) as { tag_id: number }[]) {
            newsCount.set(row.tag_id, (newsCount.get(row.tag_id) ?? 0) + 1)
        }
        const campaignCount = new Map<number, number>()
        for (const row of (ct ?? []) as { tag_id: number }[]) {
            campaignCount.set(row.tag_id, (campaignCount.get(row.tag_id) ?? 0) + 1)
        }

        return ((tags ?? []) as ITagModel[])
            .map(tag => {
                const n = newsCount.get(tag.id) ?? 0
                const c = campaignCount.get(tag.id) ?? 0
                return { ...tag, news_count: n, campaign_count: c, total_count: n + c }
            })
            .filter(t => t.total_count > 0)
            .sort((a, b) => b.total_count - a.total_count)
            .slice(0, limit)
    }

    async countRelations(tagId: number): Promise<{ news: number; campaigns: number }> {
        const [{ count: news }, { count: campaigns }] = await Promise.all([
            this.supabase.from("news_tags").select("*", { count: "exact", head: true }).eq("tag_id", tagId),
            this.supabase.from("campaign_tags").select("*", { count: "exact", head: true }).eq("tag_id", tagId),
        ])
        return { news: news ?? 0, campaigns: campaigns ?? 0 }
    }

    async getNewsByTag(slug: string): Promise<INewsModel[]> {
        const tag = await this.getBySlug(slug)
        if (!tag) return []
        const { data: pivot } = await this.supabase.from("news_tags").select("news_id").eq("tag_id", tag.id)
        const ids = ((pivot ?? []) as { news_id: number }[]).map(r => r.news_id)
        if (!ids.length) return []
        const { data } = await this.supabase.from("news")
            .select("*")
            .in("id", ids)
            .eq("published", true)
            .order("created_at", { ascending: false })
        return (data ?? []) as INewsModel[]
    }

    async getCampaignsByTag(slug: string): Promise<ICampaignModel[]> {
        const tag = await this.getBySlug(slug)
        if (!tag) return []
        const { data: pivot } = await this.supabase.from("campaign_tags").select("campaign_id").eq("tag_id", tag.id)
        const ids = ((pivot ?? []) as { campaign_id: number }[]).map(r => r.campaign_id)
        if (!ids.length) return []
        const { data } = await this.supabase.from("campaigns")
            .select("*")
            .in("id", ids)
            .eq("active", true)
            .order("created_at", { ascending: false })
        return (data ?? []) as ICampaignModel[]
    }

    async getTagIdsForNews(newsId: number): Promise<number[]> {
        const { data } = await this.supabase.from("news_tags").select("tag_id").eq("news_id", newsId)
        return ((data ?? []) as { tag_id: number }[]).map(r => r.tag_id)
    }
    async getTagIdsForCampaign(campaignId: number): Promise<number[]> {
        const { data } = await this.supabase.from("campaign_tags").select("tag_id").eq("campaign_id", campaignId)
        return ((data ?? []) as { tag_id: number }[]).map(r => r.tag_id)
    }
    //#endregion

    //#region [ Sync ]
    async syncForNews(newsId: number, tagIds: number[]): Promise<IServiceResult> {
        return this.safeCatch("syncForNews", async () => {
            const { error: delErr } = await this.supabase.from("news_tags").delete().eq("news_id", newsId)
            if (delErr) throw new Error(delErr.message)
            if (!tagIds.length) return
            const rows = tagIds.map(tag_id => ({ news_id: newsId, tag_id }))
            const { error } = await this.supabase.from("news_tags").insert(rows)
            if (error) throw new Error(error.message)
        })
    }
    // Aquí no puedo borrar todo y reinsertar porque borraría el tagged_at de los que ya estaban. Por eso calculo qué quitar y qué añadir, y dejo intactos los que se mantienen
    async syncForCampaign(campaignId: number, tagIds: number[]): Promise<IServiceResult> {
        return this.safeCatch("syncForCampaign", async () => {
            const current = await this.getTagIdsForCampaign(campaignId)
            const incoming = new Set(tagIds)
            const toRemove = current.filter(id => !incoming.has(id))
            const toAdd = tagIds.filter(id => !current.includes(id))

            if (toRemove.length) {
                const { error } = await this.supabase.from("campaign_tags")
                    .delete()
                    .eq("campaign_id", campaignId)
                    .in("tag_id", toRemove)
                if (error) throw new Error(error.message)
            }
            if (toAdd.length) {
                const rows = toAdd.map(tag_id => ({ campaign_id: campaignId, tag_id }))
                const { error } = await this.supabase.from("campaign_tags").insert(rows)
                if (error) throw new Error(error.message)
            }
        })
    }
    //#endregion

    //#region [ CRUD ]
    async create(params: ITagCreateParams): Promise<IServiceResult> {
        return this.safeCatch("create", async () => {
            if (!this.parent!.roles.validate("actions.tags.create")) {
                throw new Error("no tienes permisos para crear tags")
            }
            if (!params.name?.trim() || !params.slug?.trim()) {
                throw new Error("name y slug son obligatorios")
            }

            const record = {
                name: params.name.trim(),
                slug: params.slug.trim().toLowerCase(),
            }

            const { error } = await this.supabase.from("tags").insert(record)
            if (error) throw new Error(error.message)

            this.log("created:", record.name)
        })
    }

    async update(id: number, params: ITagUpdateParams): Promise<IServiceResult> {
        return this.safeCatch("update", async () => {
            if (!this.parent!.roles.validate("actions.tags.update")) {
                throw new Error("sin permisos para editar")
            }
            const existing = await this.getById(id)
            if (!existing) throw new Error("Tag not found")

            const record: { name?: string; slug?: string } = {}
            if (params.name !== undefined) record.name = params.name.trim()
            if (params.slug !== undefined) record.slug = params.slug.trim().toLowerCase()

            if (!Object.keys(record).length) return

            const { error } = await this.supabase.from("tags").update(record).eq("id", id)
            if (error) throw new Error(error.message)

            this.log("updated:", id, record.name ?? existing.name)
        })
    }

    async remove(id: number): Promise<IServiceResult> {
        return this.safeCatch("remove", async () => {
            if (!this.parent!.roles.validate("actions.tags.delete")) throw new Error("forbidden")
            const existing = await this.getById(id)
            if (!existing) throw new Error("Tag not found")

            // las FKs de news_tags/campaign_tags tienen ON DELETE CASCADE asi que el borrado desasocia automaticamente
            const { error } = await this.supabase.from("tags").delete().eq("id", id)
            if (error) throw new Error(error.message)
        })
    }
    //#endregion
}