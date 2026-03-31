<template>
    <div class="max-w-6xl mx-auto px-6 py-10">
        <div class="flex items-center justify-between mb-8">
            <h1 class="text-3xl font-display font-bold text-earth-900">{{ t("pages.admin.news.title") }}</h1>
            <button
                class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition"
                @click="openForm()"
            >
                {{ t("pages.admin.news.create") }}
            </button>
        </div>

        <NewsTable
            :table="table"
            @edit="editArticle"
            @toggle-publish="togglePublish"
            @delete="confirmDelete"
        />
        
        <NewsForm
            :visible="showForm"
            :editing-id="editingId"
            :form="form"
            :image-mode="imageMode"
            :selected-file="selectedFile"
            :preview-article="previewArticle"
            :errors="formErrors"
            :image-error="imageError"
            :server-error="serverError"
            @close="closeForm"
            @save="saveArticle"
            @auto-slug="autoSlug"
            @update:image-mode="imageMode = $event"
            @file-selected="onFileSelected"
            @clear-file="clearFile"
        />
    </div>
</template>

<script setup lang="ts">
import { required, minLength } from "~/src/validations"
import { useToast } from "vue-toastification"

import type { IDataTableColumn } from "~/composables/useDataTable"
import type { INewsModel } from "~/src/types"

definePageMeta({ middleware: "role-guard", requiredRole: "USER" })

const { t } = useI18n()
const { news: newsService } = useServices()
const toast = useToast()
const user = useSupabaseUser()
const columns: IDataTableColumn[] = [
    { key: "title", label: t("pages.admin.news.columns.title"), sortable: true },
    { key: "published", label: t("pages.admin.news.columns.status"), sortable: true, align: "center" },
    { key: "created_at", label: t("pages.admin.news.columns.date"), sortable: true, align: "right" },
]

// Form state
const showForm = ref(false)
const editingId = ref<number | null>(null)
const serverError = ref("")
const imageError = ref("")
const imageMode = ref<"upload" | "url">("upload")
const selectedFile = ref<File | null>(null)
const previewUrl = ref("")
const form = reactive({
    title: "",
    slug: "",
    created_at: "",
    content: "",
    excerpt: "",
    image_url: "",
    published: false,
})
const { errors: formErrors, validate } = useFormValidation(form, {
    title: [required],
    slug: [required],
    content: [required, minLength(50)],
})
const previewArticle = computed<INewsModel>(() => ({
    id: 0,
    title: form.title || t("pages.admin.news.form.previewTitle"),
    slug: form.slug || "ejemplo",
    content: "",
    excerpt: form.excerpt || null,
    image_url: imageMode.value === "upload" ? previewUrl.value || null : form.image_url || null,
    published: form.published,
    author_id: null,
    created_at: form.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
}))

// Data
const { data: articles, refresh } = await useAsyncData(
    "admin-news",
    () => newsService.fetchAll(),
)
const table = useDataTable<INewsModel>(articles, {
    columns,
    defaultSort: { key: "created_at", dir: "desc" },
})

// Helpers
function convertToSlug(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
}
function autoSlug() {
    if (!editingId.value) {
        form.slug = convertToSlug(form.title)
        // console.log("autoSlug", form.slug)
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

// Form actions
function openForm() {
    editingId.value = null
    form.title = ""
    form.slug = ""
    form.created_at = new Date().toISOString().slice(0, 10)
    form.content = ""
    form.excerpt = ""
    form.image_url = ""
    form.published = false
    serverError.value = ""
    imageError.value = ""
    Object.keys(formErrors).forEach(k => formErrors[k] = "")
    imageMode.value = "upload"
    selectedFile.value = null
    previewUrl.value = ""
    showForm.value = true
}
function editArticle(article: INewsModel) {
    editingId.value = article.id
    form.title = article.title
    form.slug = article.slug
    form.created_at = article.created_at.slice(0, 10)
    form.content = article.content
    form.excerpt = article.excerpt || ""
    form.image_url = article.image_url || ""
    form.published = article.published
    serverError.value = ""
    imageError.value = ""
    Object.keys(formErrors).forEach(k => formErrors[k] = "")
    imageMode.value = article.image_url ? "url" : "upload"
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

async function saveArticle() {
    const fieldsOk = validate()
    const hasImage = imageMode.value === "upload" ? !!selectedFile.value : !!form.image_url.trim()
    imageError.value = hasImage ? "" : t("validations.required")
    if (!fieldsOk || !hasImage) return

    let imageUrl: string | null = null
    if (imageMode.value === "upload" && selectedFile.value) {
        const { data, error } = await newsService.uploadImage(form.slug.trim(), selectedFile.value)
        if (error) {
            serverError.value = error
            return
        }
        imageUrl = data ?? null
    } else {
        imageUrl = form.image_url.trim() || null
    }

    const params = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        content: form.content.trim(),
        excerpt: form.excerpt.trim() || null,
        image_url: imageUrl,
        published: form.published,
        author_id: user.value?.id || null,
        created_at: new Date(form.created_at).toISOString(),
    }

    const result = editingId.value
        ? await newsService.update(editingId.value, params)
        : await newsService.create(params)

    if (result.error) {
        serverError.value = result.error
        return
    }

    toast.success(t(editingId.value ? "pages.admin.news.toast.updated" : "pages.admin.news.toast.created"))
    closeForm()
    refresh()
}
async function togglePublish(id: number) {
    const result = await newsService.togglePublish(id)
    if (result.error) {
        toast.error(result.error)
        return
    }
    refresh()
}
async function confirmDelete(id: number) {
    if (!confirm(t("pages.admin.news.confirmDelete"))) return
    const result = await newsService.remove(id)
    if (result.error) {
        toast.error(result.error)
        return
    }
    toast.success(t("pages.admin.news.toast.deleted"))
    refresh()
}
</script>
