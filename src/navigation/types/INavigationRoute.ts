import type { Role } from "~/src/types/roles/roles"
import type { PermissionPath } from "~/src/services/roles"

export interface INavigationRoute {
    to: string
    label: string
    icon?: string
    requiredRole?: Role
    visibilityKey?: PermissionPath
    section: "header" | "headerGuest" | "headerAuth" | "adminPanel"
    variant?: "default" | "outline" | "highlight"
    order?: number
}
