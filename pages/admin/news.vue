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
import { resolveImageUrl, convertToSlug } from "./_utils"

import type { IDataTableColumn } from "~/composables/useDataTable"
import type { INewsModel } from "~/src/types"
import type {INewsCreateParams} from "~/src/services/news"

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
const imageMode = ref<"UPLOAD" | "URL">("UPLOAD")
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
    image_url: imageMode.value === "UPLOAD" ? previewUrl.value || null : form.image_url || null,
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
// al final no hara falta paginar, son 20-30 noticias como mucho. Si crece ya veremos.
const table = useDataTable<INewsModel>(articles, {
    columns,
    defaultSort: { key: "created_at", dir: "desc" },
})

// Helpers
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
    imageMode.value = "UPLOAD"
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
    imageMode.value = article.image_url ? "URL" : "UPLOAD"
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
    const hasImage = imageMode.value === "UPLOAD" ? !!selectedFile.value : !!form.image_url.trim()
    imageError.value = hasImage ? "" : t("validations.required")
    if (!fieldsOk || !hasImage) return

    const { url: imageUrl, error: imgError } = await resolveImageUrl(
        imageMode.value, selectedFile.value, form.image_url, newsService.uploadImage, form.slug.trim(),
    )
    if (imgError) {
        serverError.value = imgError
        return
    }

    const params:INewsCreateParams = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        content: form.content.trim(),
        excerpt: form.excerpt.trim() || null,
        image_url: imageUrl,
        published: form.published,
        author_id: user.value?.id || null,
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
    const article = (articles.value ?? []).find(a => a.id === id)
    if (!article) return

    const result = await newsService.remove(id)
    if (result.error) {
        toast.error(result.error)
        return
    }
    refresh()

    toast.info(t("pages.admin.news.toast.deletedUndo", { title: article.title }), {
        timeout: 5000,
        closeOnClick: true,
        onClick: () => undoDelete(article),
    })
}
async function undoDelete(article: INewsModel) {
    const params: INewsCreateParams = {
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt,
        image_url: article.image_url,
        published: article.published,
        author_id: article.author_id,
    }
    const result = await newsService.create(params)
    if (result.error) {
        toast.error(result.error)
        return
    }
    toast.success(t("pages.admin.news.toast.restored"))
    refresh()
}
</script>
