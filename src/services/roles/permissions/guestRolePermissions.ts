import { RolePermissionsBuilder } from "../base/RolePermissionsBuilder"
import { falseRolePermissions } from "../templates/falseRolePermissions"

// visitante anonimo, solo ve contenido publico
export const guestRolePermissions = RolePermissionsBuilder.build(falseRolePermissions, {
    name: "GUEST",
    description: "Solo lectura publica",
})
