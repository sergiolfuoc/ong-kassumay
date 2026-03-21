import type { IProfileModelTable } from "./models/IProfileModel"

// TODO: faltan las tablas de news y donations
export interface Database {
    public: {
        Tables: {
            profiles: IProfileModelTable
        }
        Views: Record<string, never>
        Functions: Record<string, never>
        Enums: Record<string, never>
        CompositeTypes: Record<string, never>
    }
}
