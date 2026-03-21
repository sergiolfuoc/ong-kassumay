import type { Role } from "~/src/types/roles/roles"
import type { PermissionPath } from "~/src/services/roles"

// auth + role/visibility guard
export default defineNuxtRouteMiddleware(async (to) => {
    const user = useSupabaseUser()
    if (!user.value) {
        return navigateTo("/login")
    }

    const { roles } = useServices()
    await roles.fetchRole(user.value.sub)
    const visibilityKey = to.meta.visibilityKey as PermissionPath | undefined
    if (visibilityKey) {
        if (!roles.validate(visibilityKey)) {
            return navigateTo("/")
        }
        return
    }

    const requiredRole = (to.meta.requiredRole as Role) ?? "USER"
    if (requiredRole === "USER") return
    const roleLevel: Record<Role, number> = { GUEST: 0, USER: 1, ADMIN: 2 }
    if (roleLevel[roles.role] < roleLevel[requiredRole]) {
        return navigateTo("/")
    }
})
