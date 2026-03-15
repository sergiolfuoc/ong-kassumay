import type { INavRoute } from "./types"

export const navRoutes: INavRoute[] = [
    { to: "/", label: "composables.useNavigation.home", section: "header", order: 1 },
    { to: "/login", label: "composables.useNavigation.signIn", section: "headerGuest", order: 1 },
    { to: "/register", label: "composables.useNavigation.signUp", section: "headerGuest", order: 2, variant: "outline" },
]
