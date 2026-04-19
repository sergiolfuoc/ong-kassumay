import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/src/types/db/database"
import type { ITagModel } from "~/src/types"
import type { ServicesPlugin } from "../ServicesPlugin"
import type { IServiceResult } from "../common"
import type { ITagCreateParams, ITagUpdateParams } from "./types"
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
        return (data as ITagModel) ?? null
    }

    async getById(id: number): Promise<ITagModel | null> {
        const { data, error } = await this.supabase.from("tags").select("*").eq("id", id).single()
        if (error && error.code !== "PGRST116") throw new Error(error.message)
        return (data as ITagModel) ?? null
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

            const { error } = await this.supabase.from("tags").delete().eq("id", id)
            if (error) throw new Error(error.message)
        })
    }
    //#endregion
}
