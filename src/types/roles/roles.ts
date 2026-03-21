export const Roles = ["GUEST", "USER", "ADMIN"] as const
export type Role = (typeof Roles)[number]
