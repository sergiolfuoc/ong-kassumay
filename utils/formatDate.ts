export function formatDate(value?: string | Date | null): string {
    if (!value) return ""
    const date = value instanceof Date ? value : new Date(value)
    if (isNaN(date.getTime())) return ""

    return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

export function formatDateShort(value?: string | Date | null): string {
    if (!value) return ""
    const date = value instanceof Date ? value : new Date(value)
    if (isNaN(date.getTime())) return ""

    return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
}
