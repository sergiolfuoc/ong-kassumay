// resuelve la URL de imagen: sube si hay file, si no devuelve la URL pegada
type Uploader = (slug: string, file: File) => Promise<{ data?: string | null; error: string | null }>
export async function resolveImageUrl(
    mode: "UPLOAD" | "URL",
    file: File | null,
    pastedUrl: string,
    uploader: Uploader,
    slug: string,
): Promise<{ url: string | null; error: string | null }> {
    if (mode === "UPLOAD" && file) {
        const { data, error } = await uploader(slug, file)
        if (error) return { url: null, error }
        return { url: data ?? null, error: null }
    }
    return { url: pastedUrl.trim() || null, error: null }
}