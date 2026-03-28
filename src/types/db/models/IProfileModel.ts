import type { Simplify } from "~/src/types/utils"

// id viene de auth.users, trigger on signup crea la fila
export interface IProfileModel {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    role: "GUEST" | "USER" | "ADMIN"
    created_at: string
    updated_at: string
}

// RLS: solo puede leer/editar su propio perfil
export type IProfileModelTable = {
    Row: Simplify<IProfileModel>
    Insert: {
        id: string // must match auth.users.id
        email: string
        full_name?: string | null
        avatar_url?: string | null
        role?: "GUEST" | "USER" | "ADMIN"
    }
    Update: Pick<Partial<IProfileModel>, "email" | "full_name" | "avatar_url" | "role" | "updated_at">
    Relationships: []
}
