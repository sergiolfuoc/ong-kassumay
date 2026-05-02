<template>
    <div class="max-w-6xl mx-auto px-6 py-10">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-3xl font-display font-bold text-earth-900">{{ t("pages.admin.tags.title") }}</h1>
                <p class="text-sm text-earth-500 mt-1">
                    {{ t("pages.admin.tags.summary", { total: tags.length }) }}
                </p>
            </div>
            <button
                class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition"
                @click="openForm()">
                {{ t("pages.admin.tags.create") }}
            </button>
        </div>

        <!-- tabla -->
        <div class="bg-white rounded-xl shadow overflow-hidden">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 text-gray-600">
                    <tr>
                        <th class="px-6 py-3 text-left">{{ t("pages.admin.tags.columns.name") }}</th>
                        <th class="px-6 py-3 text-left">{{ t("pages.admin.tags.columns.slug") }}</th>
                        <th class="px-6 py-3 text-right">{{ t("components.tables.AppDataTable.actions") }}</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    <tr v-for="tag in sortedTags" :key="tag.id" class="hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-3"><span class="font-medium">{{ tag.name }}</span></td>
                        <td class="px-6 py-3"><span class="text-earth-500 text-xs font-mono">{{ tag.slug }}</span></td>
                        <td class="px-6 py-3 text-right">
                            <div class="flex gap-2 justify-end">
                                <button class="text-primary-600 hover:underline text-sm" @click="editTag(tag)">
                                    {{ t("pages.admin.tags.edit") }}
                                </button>
                                <button class="text-red-600 hover:underline text-sm" @click="confirmDelete(tag)">
                                    {{ t("pages.admin.tags.delete") }}
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-if="!sortedTags.length" class="px-6 py-8 text-center text-gray-500">
                {{ t("components.tables.AppDataTable.noResults") }}
            </p>
        </div>

        <TagForm
            :visible="showForm"
            :editing-id="editingId"
            :form="form"
            :errors="formErrors"
            :server-error="serverError"
            :can-submit="canSubmit"
            @close="closeForm"
            @save="saveTag"
            @auto-slug="autoSlug"
            @field-touched="validate"
        />
    </div>

</template>
<script setup lang="ts">
import { useToast } from "vue-toastification"
import type { ITagModel } from "~/src/types"
import { required, slug as slugValidator, maxLength } from "~/src/validations"

definePageMeta({ middleware: "role-guard", requiredRole: "ADMIN" })
const { t } = useI18n()
const { tags: tagsService } = useServices()
const toast = useToast()

// Form state
const showForm = ref(false)
const editingId = ref<number | null>(null)
const serverError = ref("")
const form = reactive({ name: "", slug: "" })
const { errors: formErrors, validate, validateField, isValid: canSubmit } = useFormValidation(form, {
    name: [required, maxLength(50)],
    slug: [required, slugValidator, maxLength(60)],
})

// Data
const { data: rawTags, refresh } = await useAsyncData(
    "admin-tags",
    () => tagsService.listAll(),
)
const tags = computed<ITagModel[]>(() => rawTags.value ?? [])
const sortedTags = computed(() => [...tags.value].sort((a, b) => a.name.localeCompare(b.name)))

// Helpers
function autoSlug() {
    if (!editingId.value) {
        form.slug = convertToSlug(form.name)
    }
}

// Form actions
function openForm() {
    editingId.value = null
    form.name = ""
    form.slug = ""
    serverError.value = ""
    Object.keys(formErrors).forEach(k => formErrors[k] = "")
    showForm.value = true
}
function editTag(tag: ITagModel) {
    editingId.value = tag.id
    form.name = tag.name
    form.slug = tag.slug
    serverError.value = ""
    Object.keys(formErrors).forEach(k => formErrors[k] = "")
    showForm.value = true
}
function closeForm() {
    showForm.value = false
    editingId.value = null
    serverError.value = ""
    Object.keys(formErrors).forEach(k => formErrors[k] = "")
}
async function saveTag() {
    if (!validate()) return

    const params = { name: form.name.trim(), slug: form.slug.trim() }
    const result = editingId.value
        ? await tagsService.update(editingId.value, params)
        : await tagsService.create(params)

    if (result.error) {
        serverError.value = result.error
        toast.error(result.error)
        return
    }

    toast.success(t(editingId.value ? "pages.admin.tags.toast.updated" : "pages.admin.tags.toast.created"))
    closeForm()
    refresh()
}
async function confirmDelete(tag: ITagModel) {
    if (!confirm(t("pages.admin.tags.confirmDelete", { name: tag.name }))) return

    const result = await tagsService.remove(tag.id)
    if (result.error) {
        toast.error(result.error)
        return
    }
    toast.success(t("pages.admin.tags.toast.deleted"))
    refresh()
}
</script>