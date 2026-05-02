<template>
    <div class="max-w-6xl mx-auto px-6 py-10">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-3xl font-display font-bold text-earth-900">{{ t("pages.admin.campaigns.title") }}</h1>
                <p class="text-sm text-earth-500 mt-1">
                    {{ t("pages.admin.campaigns.summary", { active: counters.active, inactive: counters.inactive, reached: counters.reached }) }}
                </p>
            </div>
            <button
                class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition"
                @click="form.openForm()"
            >
                {{ t("pages.admin.campaigns.create") }}
            </button>
        </div>

        <!-- Tabs -->
        <div class="flex gap-1 border-b border-earth-200 mb-5">
            <button
                v-for="tab in tabs"
                :key="tab.key"
                class="px-4 py-2 text-sm font-medium transition border-b-2 -mb-px"
                :class="activeTab === tab.key ? 'border-primary-600 text-primary-700' : 'border-transparent text-earth-500 hover:text-earth-800'"
                @click="activeTab = tab.key"
            >
                {{ t(tab.labelKey) }}
                <span class="ml-1 text-xs text-earth-400">({{ tab.count }})</span>
            </button>
        </div>

        <CampaignsTable
            :table="table"
            @edit="form.editCampaign"
            @toggle-active="askToggleActive"
            @delete="confirmDelete"
        />

        <CampaignForm
            :visible="form.showForm.value"
            :editing-id="form.editingId.value"
            :form="form.form"
            :cover-mode="form.coverMode.value"
            :selected-file="form.selectedFile.value"
            :preview-campaign="form.previewCampaign.value"
            :available-tags="availableTags"
            :tag-ids="form.selectedTagIds.value"
            :errors="form.formErrors"
            :image-error="form.imageError.value"
            :server-error="form.serverError.value"
            :can-submit="form.canSubmit.value"
            @close="form.closeForm"
            @save="form.saveCampaign"
            @slug-from-title="form.autoSlug"
            @update:cover-mode="form.coverMode.value = $event"
            @update:tag-ids="form.selectedTagIds.value = $event"
            @picked-image="form.onFileSelected"
            @clear-file="form.clearFile"
            @field-touched="form.validate"
        />
        <CampaignDeleteDialog :target="deleteTarget" @cancel="deleteTarget = null" @confirm="doDelete" />
    </div>

</template>
<script setup lang="ts">
import { useToast } from "vue-toastification"
import type { IDataTableColumn } from "~/composables/useDataTable"
import type { ICampaignModel } from "~/src/types"

definePageMeta({ middleware: "role-guard", requiredRole: "ADMIN" })

const { t } = useI18n()
const { campaigns: campaignsService, tags: tagsService } = useServices()
const toast = useToast()

const columns: IDataTableColumn[] = [
    { key: "title", label: t("pages.admin.campaigns.columns.title"), sortable: true },
    { key: "progress", label: t("pages.admin.campaigns.columns.progress"), sortable: false },
    { key: "active", label: t("pages.admin.campaigns.columns.status"), sortable: true, align: "center" },
    { key: "created_at", label: t("pages.admin.campaigns.columns.date"), sortable: true, align: "right" },
]

type TabKey = "ACTIVE" | "INACTIVE" | "REACHED" | "ALL"
const activeTab = ref<TabKey>("ACTIVE")

// Data
const { data: campaignsData, refresh } = await useAsyncData(
    "admin-campaigns",
    () => campaignsService.fetchAll(),
)
const campaigns = computed(() => campaignsData.value ?? [])

const { data: availableTagsData } = await useAsyncData("admin-campaigns-tags", () => tagsService.listAll())
const availableTags = computed(() => availableTagsData.value ?? [])

const form = useAdminCampaignForm({ onSaved: () => refresh() })

const filtered = computed<ICampaignModel[]>(() => {
    const all = campaigns.value ?? []
    if (activeTab.value === "ALL") return all
    return all.filter((c) => {
        const goal = c.goal_amount ?? 0
        const reached = goal > 0 && (c.raised_amount ?? 0) >= goal
        if (activeTab.value === "REACHED") return reached
        if (activeTab.value === "ACTIVE") return c.active && !reached
        if (activeTab.value === "INACTIVE") return !c.active
        return true
    })
})
const counters = computed(() => {
    const list = campaigns.value ?? []
    let active = 0, inactive = 0, reached = 0
    for (const c of list) {
        const goal = c.goal_amount ?? 0
        const r = goal > 0 && (c.raised_amount ?? 0) >= goal
        if (r) reached++
        if (c.active && !r) active++
        if (!c.active) inactive++
    }
    return { active, inactive, reached, total: list.length }
})
const tabs = computed(() => [
    { key: "ACTIVE" as TabKey,   labelKey: "pages.admin.campaigns.tabs.active",   count: counters.value.active },
    { key: "INACTIVE" as TabKey, labelKey: "pages.admin.campaigns.tabs.inactive", count: counters.value.inactive },
    { key: "REACHED" as TabKey,  labelKey: "pages.admin.campaigns.tabs.reached",  count: counters.value.reached },
    { key: "ALL" as TabKey,      labelKey: "pages.admin.campaigns.tabs.all",      count: counters.value.total },
])
const table = useDataTable<ICampaignModel>(filtered, {
    columns,
    defaultSort: { key: "created_at", dir: "desc" },
})

// Toggle con guard: si desactivamos una campaña con meta alcanzada, confirmamos
async function askToggleActive(id: number) {
    const c = (campaigns.value ?? []).find(x => x.id === id)
    if (c?.active && (c.goal_amount ?? 0) > 0 && (c.raised_amount ?? 0) >= (c.goal_amount ?? 0)) {
        if (!confirm(t("pages.admin.campaigns.confirmDeactivateReached"))) return
    }
    const result = await campaignsService.toggleActive(id)
    if (result.error) { toast.error(result.error); return }
    refresh()
}

// Borrado en 2 pasos
const deleteTarget = ref<ICampaignModel | null>(null)
function confirmDelete(id: number) {
    deleteTarget.value = (campaigns.value ?? []).find(x => x.id === id) ?? null
}
async function doDelete() {
    if (!deleteTarget.value) return
    const result = await campaignsService.remove(deleteTarget.value.id)
    if (result.error) { toast.error(result.error); return }
    toast.success(t("pages.admin.campaigns.toast.deleted"))
    deleteTarget.value = null
    refresh()
}

</script>