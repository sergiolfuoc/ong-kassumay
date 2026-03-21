import type { INavigationRoute } from "../types"

// TODO: añadir rutas de admin cuando este el dashboard
export const navigationRoutes: INavigationRoute[] = [
    { to: "/", label: "composables.useNavigation.home", section: "header", order: 1 },
    { to: "/login", label: "composables.useNavigation.signIn", section: "headerGuest", order: 1 },
    { to: "/register", label: "composables.useNavigation.signUp", section: "headerGuest", order: 2, variant: "outline" },
    { to: "/profile", label: "composables.useNavigation.profile", section: "headerAuth", visibilityKey: "visibility.profile.view", requiredRole: "USER", order: 1 },
]
