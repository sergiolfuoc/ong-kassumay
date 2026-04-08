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
                @click="openForm()"
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
            @edit="editCampaign"
            @toggle-active="askToggleActive"
            @delete="confirmDelete"
        />

        <CampaignForm
            :visible="showForm"
            :editing-id="editingId"
            :form="form"
            :cover-mode="coverMode"
            :selected-file="selectedFile"
            :preview-campaign="previewCampaign"
            :errors="formErrors"
            :image-error="imageError"
            :server-error="serverError"
            @close="closeForm"
            @save="saveCampaign"
            @slug-from-title="autoSlug"
            @update:cover-mode="coverMode = $event"
            @picked-image="onFileSelected"
            @clear-file="clearFile"
        />

        <!-- Dialog de borrado en 2 pasos (escribir el titulo) -->
        <Teleport to="body">
            <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center">
                <div class="absolute inset-0 bg-black/50" @click="cancelDelete" />
                <div class="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
                    <h3 class="text-lg font-bold text-earth-900 mb-2">{{ t("pages.admin.campaigns.deleteDialog.title") }}</h3>
                    <p class="text-sm text-earth-600 mb-3">
                        {{ t("pages.admin.campaigns.deleteDialog.body", { title: deleteTarget.title }) }}
                    </p>
                    <input
                        v-model="deleteConfirmText"
                        type="text"
                        class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        :placeholder="deleteTarget.title"
                    />
                    <div class="flex justify-end gap-2 mt-4">
                        <button class="px-4 py-2 text-sm rounded-lg border border-earth-300 text-earth-700 hover:bg-earth-50" @click="cancelDelete">
                            {{ t("pages.admin.campaigns.form.cancel") }}
                        </button>
                        <button
                            class="px-4 py-2 text-sm rounded-lg bg-red-600 text-white font-semibold disabled:opacity-50 hover:bg-red-700"
                            :disabled="deleteConfirmText !== deleteTarget.title"
                            @click="doDelete"
                        >
                            {{ t("pages.admin.campaigns.deleteDialog.confirm") }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>

</template>
<script setup lang="ts">
import { required, minLength, minNumber, dateRange } from "~/src/validations"
import { useToast } from "vue-toastification"
import { convertToSlug, isGoalReached, computeCounters, resolveImageUrl } from "./_utils"

import type { IDataTableColumn } from "~/composables/useDataTable"
import type { ICampaignModel } from "~/src/types"

definePageMeta({ middleware: "role-guard", requiredRole: "USER" })

const { t } = useI18n()
const { campaigns: campaignsService } = useServices()
const toast = useToast()
const user = useSupabaseUser()
const columns: IDataTableColumn[] = [
    { key: "title", label: t("pages.admin.campaigns.columns.title"), sortable: true },
    { key: "progress", label: t("pages.admin.campaigns.columns.progress"), sortable: false },
    { key: "active", label: t("pages.admin.campaigns.columns.status"), sortable: true, align: "center" },
    { key: "created_at", label: t("pages.admin.campaigns.columns.date"), sortable: true, align: "right" },
]

type TabKey = "ACTIVE" | "INACTIVE" | "REACHED" | "ALL"
const activeTab = ref<TabKey>("ACTIVE")

// Form state
const showForm = ref(false)
const editingId = ref<number | null>(null)
const serverError = ref("")
const imageError = ref("")
const coverMode = ref<"UPLOAD" | "URL">("UPLOAD")
const selectedFile = ref<File | null>(null)
const previewUrl = ref("")
const isSubmitting = ref(false) // TODO: pasar isSubmitting al form para deshabilitar el boton de save
const form = reactive({
    title: "",
    slug: "",
    description: "",
    excerpt: "",
    image_url: "",
    goal_amount: null as number | null,
    raised_amount: 0,
    start_date: "",
    end_date: "",
    active: false,
})
const { errors: formErrors, validate, reset: resetErrors } = useFormValidation(form, {
    title: [required],
    slug: [required],
    description: [required, minLength(10)],
    raised_amount: [minNumber(0)],
    end_date: [dateRange(() => form.start_date)],
})
const previewCampaign = computed<ICampaignModel>(() => ({
    id: 0,
    title: form.title || t("pages.admin.campaigns.form.previewTitle"),
    slug: form.slug || "ejemplo",
    description: "",
    excerpt: form.excerpt || null,
    image_url: coverMode.value === "UPLOAD" ? previewUrl.value || null : form.image_url || null,
    goal_amount: form.goal_amount ?? null,
    raised_amount: form.raised_amount || 0,
    start_date: form.start_date || null,
    end_date: form.end_date || null,
    active: form.active,
    author_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
}))

// Data
const { data: campaigns, refresh } = await useAsyncData(
    "admin-campaigns",
    () => campaignsService.fetchAll(),
)

const filtered = computed<ICampaignModel[]>(() => {
    const all = campaigns.value ?? []
    if (activeTab.value === "ALL") return all
    return all.filter((c) => {
        const reached = isGoalReached(c)
        if (activeTab.value === "REACHED") return reached
        if (activeTab.value === "ACTIVE") return c.active && !reached
        if (activeTab.value === "INACTIVE") return !c.active
        return true
    })
})

const counters = computed(() => computeCounters(campaigns.value ?? []))

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

function autoSlug() {
    if (!editingId.value) {
        form.slug = convertToSlug(form.title)
    }
}
const onFileSelected = (file: File | null) => {
    selectedFile.value = file
    if (file) previewUrl.value = URL.createObjectURL(file)
}
const clearFile = () => {
    selectedFile.value = null
    previewUrl.value = ""
}

function openForm() {
    editingId.value = null
    form.title = ""
    form.slug = ""
    form.description = ""
    form.excerpt = ""
    form.image_url = ""
    form.goal_amount = null
    form.raised_amount = 0
    form.start_date = ""
    form.end_date = ""
    form.active = false
    serverError.value = ""
    imageError.value = ""
    resetErrors()
    coverMode.value = "UPLOAD"
    selectedFile.value = null
    previewUrl.value = ""
    showForm.value = true
}
function editCampaign(campaign: ICampaignModel) {
    editingId.value = campaign.id
    form.title = campaign.title
    form.slug = campaign.slug
    form.description = campaign.description
    form.excerpt = campaign.excerpt || ""
    form.image_url = campaign.image_url || ""
    form.goal_amount = campaign.goal_amount
    form.raised_amount = campaign.raised_amount
    form.start_date = campaign.start_date ? campaign.start_date.slice(0, 10) : ""
    form.end_date = campaign.end_date ? campaign.end_date.slice(0, 10) : ""
    form.active = campaign.active
    serverError.value = ""
    imageError.value = ""
    resetErrors()
    coverMode.value = campaign.image_url ? "URL" : "UPLOAD"
    selectedFile.value = null
    previewUrl.value = ""
    showForm.value = true
}
function closeForm() {
    showForm.value = false
    editingId.value = null
    serverError.value = ""
    imageError.value = ""
}

async function saveCampaign() {
    if (isSubmitting.value) return
    isSubmitting.value = true
    try {
        const hasImage = coverMode.value === "UPLOAD" ? !!selectedFile.value : !!form.image_url.trim()
        if (!hasImage) {
            imageError.value = t("validations.required")
            return
        }
        imageError.value = ""

        if (!validate()) return

        const { url, error: imgError } = await resolveImageUrl(
            coverMode.value,
            selectedFile.value,
            form.image_url,
            campaignsService.uploadImage.bind(campaignsService),
            form.slug.trim(),
        )
        if (imgError) throw new Error(imgError)

        const baseFields = {
            title: form.title.trim(),
            slug: form.slug.trim(),
            description: form.description.trim(),
            excerpt: form.excerpt.trim() || null,
            image_url: url,
            author_id: user.value?.id || null,
        }
        const params = {
            ...baseFields,
            goal_amount: form.goal_amount ?? null,
            raised_amount: form.raised_amount || 0,
            start_date: form.start_date || null,
            end_date: form.end_date || null,
            active: form.active,
        }

        const result = editingId.value
            ? await campaignsService.update(editingId.value, params)
            : await campaignsService.create(params)
        if (result.error) throw new Error(result.error)

        toast.success(t(editingId.value ? "pages.admin.campaigns.toast.updated" : "pages.admin.campaigns.toast.created"))
        closeForm()
        refresh()
    } catch (e) {
        serverError.value = e instanceof Error ? e.message : String(e)
    } finally {
        isSubmitting.value = false
    }
}

// Toggle con guard: si desactivamos una campaña con meta alcanzada, confirmamos
async function askToggleActive(id: number) {
    const c = (campaigns.value ?? []).find(x => x.id === id)
    if (c?.active && isGoalReached(c)) {
        if (!confirm(t("pages.admin.campaigns.confirmDeactivateReached"))) return
    }
    const result = await campaignsService.toggleActive(id)
    if (result.error) {
        toast.error(result.error)
        return
    }
    refresh()
}

// Borrado en 2 pasos — requiere escribir el titulo exacto
const deleteTarget = ref<ICampaignModel | null>(null)
const deleteConfirmText = ref("")

function confirmDelete(id: number) {
    const c = (campaigns.value ?? []).find(x => x.id === id)
    if (!c) return
    deleteTarget.value = c
    deleteConfirmText.value = ""
}
function cancelDelete() {
    deleteTarget.value = null
    deleteConfirmText.value = ""
}
async function doDelete() {
    if (!deleteTarget.value) return
    if (deleteConfirmText.value !== deleteTarget.value.title) return
    const result = await campaignsService.remove(deleteTarget.value.id)
    if (result.error) {
        toast.error(result.error)
        return
    }
    toast.success(t("pages.admin.campaigns.toast.deleted"))
    cancelDelete()
    refresh()
}
</script>
