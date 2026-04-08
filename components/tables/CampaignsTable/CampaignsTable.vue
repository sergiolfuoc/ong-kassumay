<template>
    <AppDataTable :table="props.table" row-key="id">
        <template #cell-title="{ row }">
            <span class="font-medium">{{ row.title }}</span>
        </template>
        <template #cell-progress="{ row }">
            <span class="text-earth-700 text-sm">
                <template v-if="row.goal_amount && row.goal_amount > 0">
                    {{ Math.round(row.raised_amount).toLocaleString("es-ES") }}€ / {{ Math.round(row.goal_amount).toLocaleString("es-ES") }}€
                </template>
                <template v-else>
                    {{ Math.round(row.raised_amount).toLocaleString("es-ES") }}€
                </template>
            </span>
        </template>
        <template #cell-active="{ row }">
            <StatusBadgeComp :variant="row.active ? 'active' : 'inactive'">
                {{ row.active ? t("pages.admin.campaigns.active") : t("pages.admin.campaigns.inactive") }}
            </StatusBadgeComp>
        </template>
        <template #cell-created_at="{ row }">
            <span class="text-gray-500">{{ formatDateShort(row.created_at) }}</span>
        </template>
        <template #actions="{ row }">
            <div class="flex gap-2 justify-end">
                <button class="text-primary-600 hover:underline text-sm" @click="$emit('edit', row)">
                    {{ t("pages.admin.campaigns.edit") }}
                </button>
                <button class="text-sm" :class="row.active ? 'text-yellow-600 hover:underline' : 'text-green-600 hover:underline'" @click="$emit('toggle-active', row.id)">
                    {{ row.active ? t("pages.admin.campaigns.deactivate") : t("pages.admin.campaigns.activate") }}
                </button>
                <button class="text-red-600 hover:underline text-sm" @click="$emit('delete', row.id)">
                    {{ t("pages.admin.campaigns.delete") }}
                </button>
            </div>
        </template>
    </AppDataTable>

</template>
<script setup lang="ts">
import type { IDataTable } from "~/composables/useDataTable"
import type { ICampaignModel } from "~/src/types"
import { formatDateShort } from "~/utils/formatDate";

const { t } = useI18n()

const props = defineProps<{
    table: IDataTable<ICampaignModel>
}>()

defineEmits(["edit", "toggle-active", "delete"])
</script>
