import type { IRolePermissions, RecursivePartial } from "./IRolePermissions"

export class RolePermissionsBuilder {
    static build(base: IRolePermissions<boolean>, update: RecursivePartial<IRolePermissions<boolean>>): IRolePermissions<boolean> {
        return this._deepMerge(JSON.parse(JSON.stringify(base)), update)
    }

    private static _deepMerge<T extends Record<string, any>>(target: T, source: RecursivePartial<T>): T {
        for (const key of Object.keys(source) as (keyof T)[]) {
            const srcVal = source[key] as T[keyof T] | RecursivePartial<T[keyof T]> | undefined
            const tgtVal = target[key]

            if (srcVal != null && typeof srcVal === "object" && !Array.isArray(srcVal) && tgtVal != null && typeof tgtVal === "object" && !Array.isArray(tgtVal)) {
                target[key] = this._deepMerge(tgtVal, srcVal as RecursivePartial<typeof tgtVal>)
            } else if (srcVal !== undefined) {
                target[key] = srcVal as T[keyof T]
            }
        }
        return target
    }
}
