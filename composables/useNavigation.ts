import type { INavRoute } from "~/src/navigation"
import { navRoutes } from "~/src/navigation"

export function useNavigation() {
	const user = useSupabaseUser()

	function filterBySection(section: INavRoute["section"]) {
		return computed(() =>
			navRoutes
				.filter((r) => r.section === section)
				.sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
		)
	}

	const headerRoutes = filterBySection("header")
	const headerGuestRoutes = filterBySection("headerGuest")

	return {
		user,
		headerRoutes,
		headerGuestRoutes,
	}
}
