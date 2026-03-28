<template>
    <div>
        <div class="bg-white rounded-xl shadow overflow-hidden">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 text-gray-600">
                    <tr>
                        <th
                            v-for="col in props.table.columns"
                            :key="col.key"
                            class="px-6 py-3"
                            :class="[alignClass(col.align), col.sortable ? 'cursor-pointer select-none hover:text-gray-900' : '']"
                            @click="col.sortable ? props.table.sortBy(col.key) : undefined"
                        >
                            <span class="inline-flex items-center gap-1">
                                {{ col.label }}
                                <span v-if="col.sortable && props.table.sort.value?.key === col.key" class="text-primary-600">
                                    <ArrowUpIcon v-if="props.table.sort.value.dir === 'asc'" icon-class="w-3 h-3" />
                                    <ArrowDownIcon v-else icon-class="w-3 h-3" />
                                </span>
                            </span>
                        </th>
                        <th v-if="$slots.actions" class="px-6 py-3 text-right">{{ t("components.tables.AppDataTable.actions") }}</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    <tr v-for="(row, idx) in props.table.rows.value" :key="props.rowKey ? (row as any)[props.rowKey] : idx" class="hover:bg-gray-50 transition-colors">
                        <td v-for="col in props.table.columns" :key="col.key" class="px-6 py-3" :class="alignClass(col.align)">
                            <slot :name="`cell-${col.key}`" :row="row">
                                {{ (row as any)[col.key] }}
                            </slot>
                        </td>
                        <td v-if="$slots.actions" class="px-6 py-3 text-right">
                            <slot name="actions" :row="row" />
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-if="!props.table.rows.value.length" class="px-6 py-8 text-center text-gray-500">
                {{ t("components.tables.AppDataTable.noResults") }}
            </p>
        </div>
    </div>

</template>
<script setup lang="ts">
import type { IDataTableColumn, IDataTableSort } from "~/composables/useDataTable"

const { t } = useI18n()

// TODO: hacer este componente generico (tipados etc) cuando lo necesite
interface Props {
    table: {
        columns: IDataTableColumn[]
        sort: Ref<IDataTableSort | null>
        rows: ComputedRef<any[]>
        sortBy: (key: string) => void
    }
    rowKey?: string
}
// No need to use "props" in the template but I use it to make template more readable
const props = defineProps<Props>()


const alignClass = (align?: "left" | "center" | "right") => align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"

</script>
