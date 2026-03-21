// arbol de permisos: visibility (que ve el user) + actions (que puede hacer)
export interface IRolePermissions<TData> {
    name: string
    description: string
    visibility: {
        profile: {
            view: TData
        }
    }
    actions: {
        profile: {
            update: TData
        }
    }
}

// Snab code (from my job): recursive mapped type to validate permission paths at compile time
type NestedPath<T, Prefix extends string = ""> = T extends boolean
    ? Prefix
    : T extends string
      ? Prefix
      : {
            [K in keyof T & string]: NestedPath<T[K], Prefix extends "" ? K : `${Prefix}.${K}`>
        }[keyof T & string]

export type PermissionPath = NestedPath<IRolePermissions<boolean>>

export type RecursivePartial<T> = {
    [K in keyof T]?: T[K] extends object ? RecursivePartial<T[K]> : T[K]
}
