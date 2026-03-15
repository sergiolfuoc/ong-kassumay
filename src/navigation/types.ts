export interface INavRoute {
    to: string
    label: string
    icon?: string
    section: "header" | "headerGuest"
    variant?: "default" | "outline" | "highlight"
    order?: number
}
