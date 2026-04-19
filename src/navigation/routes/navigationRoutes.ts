import type { INavigationRoute } from "../types"

export const navigationRoutes: INavigationRoute[] = [
    { to: "/", label: "composables.useNavigation.home", section: "header", order: 1 },
    { to: "/news", label: "composables.useNavigation.news", section: "header", order: 2 },
    { to: "/campaigns", label: "composables.useNavigation.campaigns", section: "header", order: 3 },

    { to: "/login", label: "composables.useNavigation.signIn", section: "headerGuest", order: 1 },
    { to: "/register", label: "composables.useNavigation.signUp", section: "headerGuest", order: 2, variant: "outline" },

    { to: "/profile", label: "composables.useNavigation.profile", section: "headerAuth", visibilityKey: "visibility.profile.view", requiredRole: "USER", order: 1 },
    
    { to: "/admin/news", label: "composables.useNavigation.adminNews", section: "adminPanel", requiredRole: "USER", order: 1 },
    { to: "/admin/campaigns", label: "composables.useNavigation.adminCampaigns", section: "adminPanel", requiredRole: "USER", order: 2 },
    { to: "/admin/tags", label: "composables.useNavigation.adminTags", section: "adminPanel", requiredRole: "USER", order: 3 },
]
