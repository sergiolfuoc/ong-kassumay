import { RolePermissionsBuilder } from "../base/RolePermissionsBuilder"
import { falseRolePermissions } from "../templates/falseRolePermissions"

// user logueado, ve contenido publico + su perfil
export const userRolePermissions = RolePermissionsBuilder.build(falseRolePermissions, {
    name: "USER",
    description: "Lectura y gestion del propio perfil",
    visibility: {
        profile: { view: true },
        news: { list: true },
    },
    actions: {
        profile: { update: true },
    },
})
