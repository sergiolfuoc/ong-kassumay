import { trueRolePermissions } from "./trueRolePermissions"
import type { IRolePermissions } from "../base/IRolePermissions"

// invierte todos los booleans del template true
// TODO: tipar esto mejor, el any es feo
function negateBooleans(obj: any): any {
    if (typeof obj === "boolean") return false
    if (typeof obj !== "object" || obj === null) return obj
    const result: any = {}
    for (const key of Object.keys(obj)) {
        result[key] = negateBooleans(obj[key])
    }
    return result
}

// este template cubre el unico caso (anonimo / no autenticado).
export const falseRolePermissions: IRolePermissions<boolean> = {
    ...negateBooleans(trueRolePermissions),
    name: "ALL-FALSE",
    description: "All visibility and actions set to false",
}
