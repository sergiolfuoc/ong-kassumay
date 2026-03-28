import type { IProfileModelTable } from "./models/IProfileModel"
import type { INewsModelTable } from "./models/INewsModel"

// TODO: faltan las tablas de news y donations
export interface Database {
    public: {
        Tables: {
            profiles: IProfileModelTable
            news: INewsModelTable
        }
        Views: Record<string, never>
        Functions: Record<string, never>
        Enums: Record<string, never>
        CompositeTypes: Record<string, never>
    }
}
