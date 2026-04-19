import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/src/types/db/database"
import type { INewsModel, INewsModelTable } from "~/src/types"
import type { ServicesPlugin } from "../ServicesPlugin"
import type { IServiceResult } from "../common"
import type { INewsCreateParams, INewsUpdateParams } from "./types"
import { PluginBase } from "../_base"

export class NewsServicePlugin extends PluginBase<ServicesPlugin> {
    name = "news"

    constructor(private readonly supabase: SupabaseClient<Database>, parent: ServicesPlugin | null = null) {
        super(parent)
    }

    protected _setup() { this.debug = !!import.meta.dev }

    //#region [ Query ]
    async getBySlug(slug: string): Promise<INewsModel | null> {
        const { data } = await this.supabase.from("news").select("*")
            .eq("slug", slug)
            .eq("published", true)
            .single()
        return (data as INewsModel) ?? null
    }
    async getById(id: number): Promise<INewsModel | null> {
        const { data } = await this.supabase.from("news").select("*").eq("id", id).single()
        return (data as INewsModel) ?? null
    }

    async fetchPublished(limit?: number): Promise<INewsModel[]> {
        let query = this.supabase.from("news").select("*")
            .eq("published", true)
            .order("created_at", { ascending: false })
        if (limit) query = query.limit(limit)
        const { data } = await query
        return (data ?? []) as INewsModel[]
    }
    async fetchAll(): Promise<INewsModel[]> {
        const { data } = await this.supabase.from("news")
            .select("*")
            .order("created_at", { ascending: false })
        return (data ?? []) as INewsModel[]
    }

    async count(): Promise<number> {
        const { count } = await this.supabase.from("news")
            .select("*", { count: "exact", head: true })
            .eq("published", true)
        return count || 0
    }
    //#endregion

    //#region [ CRUDS ]
    async create(params: INewsCreateParams): Promise<IServiceResult<number>> {
        return this.safeCatch("create", async () => {
            if (!this.parent!.roles.validate("actions.news.create")) {
                throw new Error("no tienes permisos para crear noticias")
            }

            if (!params.title?.trim() || !params.slug?.trim() || !params.content?.trim()) {
                throw new Error("Title, slug and content are required")
            }

            const record = {
                title: params.title.trim(),
                slug: params.slug.trim().toLowerCase(),
                content: params.content.trim(),
                excerpt: params.excerpt?.trim() || null,
                image_url: params.image_url || null,
                published: params.published,
                author_id: params.author_id || null,
            }

            const { data, error } = await this.supabase.from("news").insert(record).select("id").single()
            if (error) throw new Error(error.message)

            this.log("created:", record.title)
            return (data as { id: number }).id
        })
    }
    async update(id: number, params: INewsUpdateParams): Promise<IServiceResult> {
        return this.safeCatch("update", async () => {
            if (!this.parent!.roles.validate("actions.news.update")) {
                throw new Error("sin permisos para editar")
            }

            const existing = await this.getById(id)
            if (!existing) throw new Error("Article not found")

            const record: INewsModelTable["Update"] = {
                updated_at: new Date().toISOString(),
            }
            if (params.title !== undefined) record.title = params.title.trim()
            if (params.slug !== undefined) record.slug = params.slug.trim().toLowerCase()
            if (params.content !== undefined) record.content = params.content.trim()
            if (params.excerpt !== undefined) record.excerpt = params.excerpt?.trim() || null
            if (params.image_url !== undefined) record.image_url = params.image_url || null
            if (params.published !== undefined) record.published = params.published

            const { error } = await this.supabase.from("news").update(record).eq("id", id)
            if (error) throw new Error(error.message)

            this.log("updated:", id, record.title ?? existing.title)
        })
    }
    async togglePublish(id: number): Promise<IServiceResult> {
        return this.safeCatch("togglePublish", async () => {
            if (!this.parent!.roles.validate("actions.news.publish")) throw new Error("Not authorized")
            const existing = await this.getById(id)
            if (!existing) throw new Error("Article not found")

            const published = !existing.published
            const { error } = await this.supabase.from("news").update({ published, updated_at: new Date().toISOString() }).eq("id", id)
            if (error) throw new Error(error.message)
        })
    }
    async remove(id: number): Promise<IServiceResult> {
        return this.safeCatch("remove", async () => {
            if (!this.parent!.roles.validate("actions.news.delete")) throw new Error("forbidden")
            const existing = await this.getById(id)
            if (!existing) throw new Error("Article not found")

            const { error } = await this.supabase.from("news").delete().eq("id", id)
            if (error) throw new Error(error.message)
        })
    }
    async uploadImage(slug: string, file: File): Promise<IServiceResult<string>> {
        return this.safeCatch("uploadImage", async () => {
            const extension = file.name.split(".").pop() ?? "png"
            const path = `${slug}/${Date.now()}.${extension}`

            const { error: uploadError } = await this.supabase.storage
                .from("news-images")
                .upload(path, file, { upsert: true })
            if (uploadError) throw new Error(uploadError.message)

            const { data: urlData } = this.supabase.storage
                .from("news-images")
                .getPublicUrl(path)

            return `${urlData.publicUrl}?t=${Date.now()}`
        })
    }
    //#endregion
}
