<template>
    <AppDataTable :table="props.table" row-key="id">
        <template #cell-title="{ row }">
            <span class="font-medium">{{ row.title }}</span>
        </template>
        <template #cell-published="{ row }">
            <StatusBadgeComp :variant="row.published ? 'published' : 'draft'">
                {{ row.published ? t("pages.admin.news.published") : t("pages.admin.news.draft") }}
            </StatusBadgeComp>
        </template>
        <template #cell-created_at="{ row }">
            <span class="text-gray-500">{{ formatDateShort(row.created_at) }}</span>
        </template>
        <template #actions="{ row }">
            <div class="flex gap-2 justify-end">
                <button class="text-primary-600 hover:underline text-sm" @click="$emit('edit', row)">
                    {{ t("pages.admin.news.edit") }}
                </button>
                <button class="text-sm" :class="row.published ? 'text-yellow-600 hover:underline' : 'text-green-600 hover:underline'" @click="$emit('toggle-publish', row.id)">
                    {{ row.published ? t("pages.admin.news.unpublish") : t("pages.admin.news.publish") }}
                </button>
                <button class="text-red-600 hover:underline text-sm" @click="$emit('delete', row.id)">
                    {{ t("pages.admin.news.delete") }}
                </button>
            </div>
        </template>
    </AppDataTable>

</template>
<script setup lang="ts">
import type { IDataTable } from "~/composables/useDataTable"
import type { INewsModel } from "~/src/types"
import { formatDateShort } from "~/utils/formatDate"

const { t } = useI18n()

const props = defineProps<{
    table: IDataTable<INewsModel>
}>()

defineEmits(["edit", "toggle-publish", "delete"])
</script>
