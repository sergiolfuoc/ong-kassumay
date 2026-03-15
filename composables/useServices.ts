import type { ServicesPlugin } from "~/src/services"

export function useServices(): ServicesPlugin {
	return useNuxtApp().$services as ServicesPlugin
}
