import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/src/types/db/database"
import type { ICampaignModel, ICampaignModelTable } from "~/src/types"
import type { ServicesPlugin } from "../ServicesPlugin"
import type { IServiceResult } from "../common"
import type { ICampaignCreateParams, ICampaignUpdateParams } from "./types"
import { PluginBase } from "../_base"

export class CampaignServicePlugin extends PluginBase<ServicesPlugin> {
    name = "campaigns"

    constructor(private readonly supabase: SupabaseClient<Database>, parent: ServicesPlugin | null = null) {
        super(parent)
    }

    protected _setup() { this.debug = !!import.meta.dev }

    //#region [ Reads ]
    async fetchAll(): Promise<ICampaignModel[]> {
        const { data } = await this.supabase.from("campaigns")
            .select("*")
            .order("created_at", { ascending: false })
        return (data ?? []) as ICampaignModel[]
    }
    async fetchActive(limit?: number): Promise<ICampaignModel[]> {
        let query = this.supabase.from("campaigns").select("*")
            .eq("active", true)
            .order("created_at", { ascending: false })
        if (limit) query = query.limit(limit)
        const { data } = await query
        return (data ?? []) as ICampaignModel[]
    }
    async getById(id: number): Promise<ICampaignModel | null> {
        const { data } = await this.supabase.from("campaigns").select("*").eq("id", id).single()
        return (data as ICampaignModel) ?? null
    }
    async getBySlug(slug: string, onlyActive = true): Promise<ICampaignModel | null> {
        let query = this.supabase.from("campaigns").select("*").eq("slug", slug)
        if (onlyActive) query = query.eq("active", true)
        const { data } = await query.single()
        return (data as ICampaignModel) ?? null
    }
    async count(): Promise<number> {
        const { count } = await this.supabase.from("campaigns")
            .select("*", { count: "exact", head: true })
            .eq("active", true)
        return count || 0
    }
    //#endregion

    //#region [ Storage ]
    async uploadImage(slug: string, file: File): Promise<IServiceResult<string>> {
        return this.safeCatch("uploadImage", async () => {
            const ext = file.name.split(".").pop() ?? "jpg"
            const path = `${slug}/${Date.now()}.${ext}`

            const { error: uploadError } = await this.supabase.storage
                .from("campaign-images")
                .upload(path, file, { upsert: true })
            if (uploadError) throw new Error(uploadError.message)

            const { data: urlData } = this.supabase.storage
                .from("campaign-images")
                .getPublicUrl(path)

            return `${urlData.publicUrl}?t=${Date.now()}`
        })
    }
    //#endregion

    //#region [ Activation ]
    async toggleActive(id: number): Promise<IServiceResult> {
        return this.safeCatch("toggleActive", async () => {
            if (!this.parent!.roles.validate("actions.campaigns.activate")) throw new Error("Not authorized")
            const existing = await this.getById(id)
            if (!existing) throw new Error("Campaign not found")

            const active = !existing.active
            const { error } = await this.supabase.from("campaigns").update({ active, updated_at: new Date().toISOString() }).eq("id", id)
            if (error) throw new Error(error.message)
        })
    }
    //#endregion

    //#region [ CUD ]
    async create(params: ICampaignCreateParams): Promise<IServiceResult<number>> {
        return this.safeCatch("create", async () => {
            if (!this.parent!.roles.validate("actions.campaigns.create")) {
                throw new Error("no tienes permisos para crear campañas")
            }

            if (!params.title?.trim() || !params.slug?.trim()) {
                throw new Error("Title, slug are required")
            }

            // validaciones de negocio
            if (params.goal_amount != null && params.goal_amount < 0) {
                throw new Error("goal invalido")
            }
            if (params.goal_amount != null && params.goal_amount > 0 && params.goal_amount < 100) {
                throw new Error("La meta minima es 100€")
            }
            if (params.start_date && params.end_date) {
                const s = new Date(params.start_date).getTime()
                const e = new Date(params.end_date).getTime()
                if (e <= s) throw new Error("end_date debe ser posterior a start_date")
            }

            const record = {
                title: params.title.trim(),
                slug: params.slug.trim().toLowerCase(),
                description: params.description?.trim() || "",
                excerpt: params.excerpt?.trim() || null,
                image_url: params.image_url || null,
                goal_amount: params.goal_amount ?? null,
                raised_amount: params.raised_amount ?? 0,
                start_date: params.start_date || null,
                end_date: params.end_date || null,
                active: params.active,
                author_id: params.author_id || null,
            }

            const { data, error } = await this.supabase.from("campaigns").insert(record).select("id").single()
            if (error) throw new Error(error.message)

            this.log("created:", record.title)
            return (data as { id: number }).id
        })
    }
    async update(id: number, params: ICampaignUpdateParams): Promise<IServiceResult> {
        return this.safeCatch("update", async () => {
            if (!this.parent!.roles.validate("actions.campaigns.update")) {
                throw new Error("sin permisos para editar")
            }

            const existing = await this.getById(id)
            if (!existing) throw new Error("Campaign not found")

            // reglas basicas sobre fechas si se estan tocando
            const nextStart = params.start_date !== undefined ? params.start_date : existing.start_date
            const nextEnd = params.end_date !== undefined ? params.end_date : existing.end_date
            if (nextStart && nextEnd) {
                if (new Date(nextEnd).getTime() <= new Date(nextStart).getTime()) {
                    throw new Error("end_date debe ser posterior a start_date")
                }
            }

            const record: ICampaignModelTable["Update"] = {
                updated_at: new Date().toISOString(),
            }
            if (params.title !== undefined) record.title = params.title.trim()
            if (params.slug !== undefined) record.slug = params.slug.trim().toLowerCase()
            if (params.description !== undefined) record.description = params.description.trim()
            if (params.excerpt !== undefined) record.excerpt = params.excerpt?.trim() || null
            if (params.image_url !== undefined) record.image_url = params.image_url || null
            if (params.goal_amount !== undefined) record.goal_amount = params.goal_amount
            if (params.raised_amount !== undefined) record.raised_amount = params.raised_amount
            if (params.start_date !== undefined) record.start_date = params.start_date || null
            if (params.end_date !== undefined) record.end_date = params.end_date || null
            if (params.active !== undefined) record.active = params.active

            const { error } = await this.supabase.from("campaigns").update(record).eq("id", id)
            if (error) throw new Error(error.message)

            this.log("updated:", id, record.title ?? existing.title)
        })
    }
    async remove(id: number): Promise<IServiceResult> {
        return this.safeCatch("remove", async () => {
            if (!this.parent!.roles.validate("actions.campaigns.delete")) throw new Error("forbidden")
            const existing = await this.getById(id)
            if (!existing) throw new Error("Campaign not found")

            // no dejamos borrar campañas activas
            if (existing.active) {
                throw new Error("No se puede eliminar una campaña activa. Desactivala primero.")
            }

            const { error } = await this.supabase.from("campaigns").delete().eq("id", id)
            if (error) throw new Error(error.message)
        })
    }
    //#endregion
}
