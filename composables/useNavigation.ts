import { navigationRoutes, type INavigationRoute } from "~/src/navigation"
import type { Role } from "~/src/types"


// navegacion + sync de rol
export function useNavigation() {
	const user = useSupabaseUser()
	const services = useServices()

	const { data: profile, refresh: refreshProfile } = useAsyncData("nav-profile", async () => {
		if (!user.value) return null
		return services.profiles.fetchById(user.value.sub)
	})

	// re-fetch profile when user changes (login / logout)
	watch(user, () => { refreshProfile() })

	const role = computed<Role>(() => {
		if (!user.value) return "GUEST"
		const raw = profile.value?.role ?? "user"
		return raw.toUpperCase() as Role
	})

	// sincronizar rol con RoleServicePlugin
	watch(role, (newRole) => { services.roles.setRole(newRole) }, { immediate: true })

	const isAdmin = computed(() => role.value === "ADMIN")

	// filtrar rutas por seccion
	function filterBySection(section: INavigationRoute["section"]) {
		return computed(() =>
			navigationRoutes
				.filter((r) => r.section === section)
				.filter((r) => {
					if (r.visibilityKey) return services.roles.validate(r.visibilityKey)
					if (!r.requiredRole) return true
					const level: Record<Role, number> = { GUEST: 0, USER: 1, ADMIN: 2 }
					return level[role.value] >= level[r.requiredRole]
				})
				.sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
		)
	}

	const headerRoutes = filterBySection("header")
	const headerGuestRoutes = filterBySection("headerGuest")
	const headerAuthRoutes = filterBySection("headerAuth")

	return {
		user,
		profile,
		role,
		isAdmin,
		headerRoutes,
		headerGuestRoutes,
		headerAuthRoutes,
	}
}
