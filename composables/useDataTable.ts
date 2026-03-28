import type { Ref, ComputedRef } from "vue"

export interface IDataTableColumn {
    key: string
    label: string
    sortable?: boolean
    align?: "left" | "center" | "right"
}

export interface IDataTableSort {
    key: string
    dir: "asc" | "desc"
}

export interface IDataTable<T> {
    columns: IDataTableColumn[]
    sort: Ref<IDataTableSort | null>
    rows: ComputedRef<T[]>
    sortBy: (key: string) => void
}

export function useDataTable<T>(
    source: Ref<T[] | null | undefined> | ComputedRef<T[] | null | undefined>,
    options: { columns: IDataTableColumn[]; defaultSort?: IDataTableSort }
): IDataTable<T> {
    // TODO: de momento solo hay sort. Queda pendiente aplicar paginaciones
    const sort = ref<IDataTableSort | null>(options.defaultSort ?? null)

    const sortedData = computed<T[]>(() => {
        const rows = unref(source) ?? []
        if (!sort.value) return rows

        const { key, dir } = sort.value
        return [...rows].sort((a, b) => {
            const nestedValueFromA = (a as any)[key]
            const nestedValueFromB = (b as any)[key]
            if (nestedValueFromA == null && nestedValueFromB == null) return 0
            if (nestedValueFromA == null) return 1
            if (nestedValueFromB == null) return -1
            let comparation = 0
            if (typeof nestedValueFromA === "number" && typeof nestedValueFromB === "number") {
                comparation = nestedValueFromA - nestedValueFromB
            } else if (String(nestedValueFromA) < String(nestedValueFromB)) {
                comparation = -1
            } else if (String(nestedValueFromA) > String(nestedValueFromB)) {
                comparation = 1
            }
            return dir === "asc" ? comparation : -comparation
        })
    })

    function sortBy(key: string) {
        if (sort.value?.key === key) {
            sort.value = { key, dir: sort.value.dir === "asc" ? "desc" : "asc" }
        } else {
            sort.value = { key, dir: "asc" }
        }
    }

    return {
        columns: options.columns,
        sort,
        rows: sortedData,
        sortBy,
    }
}
