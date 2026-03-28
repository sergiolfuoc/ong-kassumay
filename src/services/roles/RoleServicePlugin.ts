import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/src/types/db/database"
import type { Role } from "~/src/types/roles/roles"
import type { IRolePermissions, PermissionPath } from "./base/IRolePermissions"
import { adminRolePermissions } from "./permissions/adminRolePermissions"
import { userRolePermissions } from "./permissions/userRolePermissions"
import { guestRolePermissions } from "./permissions/guestRolePermissions"
import { PluginBase } from "../_base"
import { ref } from "vue"

export class RoleServicePlugin extends PluginBase {
    name = "roles"

    private _descriptors = new Map<string, IRolePermissions<boolean>>()
    private _role = ref<Role>("GUEST")
    private _userId: string | null = null

    constructor(private readonly _supabase: SupabaseClient<Database>, parent: PluginBase | null = null) {
        super(parent)
    }

    protected async _setup(): Promise<void> {
        this._register(adminRolePermissions)
        this._register(userRolePermissions)
        this._register(guestRolePermissions)
    }


    get role(): Role {
        return this._role.value
    }
    get descriptors(): Map<string, IRolePermissions<boolean>> {
        return this._descriptors
    }
    get myDescriptor(): IRolePermissions<boolean> {
        return this._descriptors.get(this._role.value) ?? this._descriptors.get("GUEST")!
    }
    get isAdmin(): boolean {
        return this._role.value === "ADMIN"
    }
    get isAuthenticated(): boolean {
        return this._role.value !== "GUEST"
    }

    setRole(role: Role): void {
        this._role.value = role
        this.log("role set to:", role)
    }
    async fetchRole(userId: string): Promise<Role> {
        if (this._userId === userId && this._role.value !== "GUEST") {
            return this._role.value
        }
        this._userId = userId
        const { data } = await this._supabase.from("profiles").select("role").eq("id", userId).single()
        const raw = (data as { role: string } | null)?.role ?? "user"
        const role = raw.toUpperCase() as Role
        this.setRole(role)
        return role
    }
    clear(): void {
        this._userId = null
        this._role.value = "GUEST"
    }

    // resolve dot path (e.g. "actions.news.create")
    // TODO: cuando haya noticias, añadir permisos de news aqui tambien
    validate(path: PermissionPath): boolean {
        const descriptor = this.myDescriptor
        return this._resolvePath(descriptor, path)
    }

    private _register(permissions: IRolePermissions<boolean>): void {
        this._descriptors.set(permissions.name, permissions)
    }

    private _resolvePath(obj: any, path: string): boolean {
        const parts = path.split(".")
        let current = obj
        for (const part of parts) {
            if (current == null || typeof current !== "object") return false
            current = (current)[part]
        }
        return current === true
    }
}
