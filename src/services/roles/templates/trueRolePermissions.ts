import type { IRolePermissions } from "../base/IRolePermissions"

export const trueRolePermissions: IRolePermissions<boolean> = {
    name: "ALL-TRUE",
    description: "All visibility and actions set to true",
    visibility: {
        profile: { view: true },
    },
    actions: {
        profile: { update: true },
    },
}
