import { RolePermissionsBuilder } from "../base/RolePermissionsBuilder"
import { trueRolePermissions } from "../templates/trueRolePermissions"

// admin tiene todo, solo override nombre
export const adminRolePermissions = RolePermissionsBuilder.build(trueRolePermissions, {
    name: "ADMIN",
    description: "Acceso total",
})
