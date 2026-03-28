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
            :error="formError"
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
import type { INewsModel } from "~/src/types"
import type { IDataTableColumn } from "~/composables/useDataTable"

definePageMeta({ middleware: "role-guard", requiredRole: "USER" })

const { t } = useI18n()
const { news: newsService } = useServices()
const user = useSupabaseUser()
const columns: IDataTableColumn[] = [
    { key: "title", label: t("pages.admin.news.columns.title"), sortable: true },
    { key: "published", label: t("pages.admin.news.columns.status"), sortable: true, align: "center" },
    { key: "created_at", label: t("pages.admin.news.columns.date"), sortable: true, align: "right" },
]

// Form state
const showForm = ref(false)
const editingId = ref<number | null>(null)
const formError = ref("")
const imageMode = ref<"upload" | "url">("upload")
const selectedFile = ref<File | null>(null)
const previewUrl = ref("")
const form = reactive({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    image_url: "",
    published: false,
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
    created_at: new Date().toISOString(),
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
    form.content = ""
    form.excerpt = ""
    form.image_url = ""
    form.published = false
    formError.value = ""
    imageMode.value = "upload"
    selectedFile.value = null
    previewUrl.value = ""
    showForm.value = true
}
function editArticle(article: INewsModel) {
    editingId.value = article.id
    form.title = article.title
    form.slug = article.slug
    form.content = article.content
    form.excerpt = article.excerpt || ""
    form.image_url = article.image_url || ""
    form.published = article.published
    formError.value = ""
    imageMode.value = article.image_url ? "url" : "upload"
    selectedFile.value = null
    previewUrl.value = ""
    showForm.value = true
}
function closeForm() {
    showForm.value = false
    editingId.value = null
    formError.value = ""
}

async function saveArticle() {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
        formError.value = t("pages.admin.news.form.required")
        return
    }

    let imageUrl: string | null = null
    try {
        if (imageMode.value === "upload" && selectedFile.value) {
            imageUrl = await newsService.uploadImage(form.slug.trim(), selectedFile.value)
        } else {
            imageUrl = form.image_url.trim() || null
        }
    } catch (err) {
        formError.value = err instanceof Error ? err.message : String(err)
        return
    }

    const params = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        content: form.content.trim(),
        excerpt: form.excerpt.trim() || null,
        image_url: imageUrl,
        published: form.published,
        author_id: user.value?.id || null,
    }
    try {
        if (editingId.value) {
            await newsService.update(editingId.value, params)
        } else {
            await newsService.create(params)
        }
    } catch (err) {
        formError.value = err instanceof Error ? err.message : String(err)
        return
    }

    closeForm()
    refresh()
}
async function togglePublish(id: number) {
    await newsService.togglePublish(id)
    refresh()
}
async function confirmDelete(id: number) {
    if (!confirm(t("pages.admin.news.confirmDelete"))) return
    await newsService.remove(id)
    refresh()
}
</script>
