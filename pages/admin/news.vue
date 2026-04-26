<template>
    <div class="max-w-6xl mx-auto px-6 py-10">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-3xl font-display font-bold text-earth-900">{{ t("pages.admin.news.title") }}</h1>
                <p class="text-sm text-earth-500 mt-1">
                    {{ t("pages.admin.news.summary", { published: counters.published, draft: counters.draft }) }}
                </p>
            </div>
            <button
                class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition"
                @click="openForm()"
            >
                {{ t("pages.admin.news.create") }}
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
            :cover-mode="coverMode"
            :selected-file="selectedFile"
            :preview-article="previewArticle"
            :available-tags="availableTags"
            :tag-ids="selectedTagIds"
            :errors="formErrors"
            :image-error="imageError"
            :server-error="serverError"
            :can-submit="canSubmit"
            @close="closeForm"
            @save="saveArticle"
            @auto-slug="autoSlug"
            @update:cover-mode="coverMode = $event"
            @update:tag-ids="selectedTagIds = $event"
            @file-selected="onFileSelected"
            @clear-file="clearFile"
            @field-touched="validate"
        />
    </div>
</template>

<script setup lang="ts">
import { required, minLength } from "~/src/validations"
import { useToast } from "vue-toastification"
import { resolveImageUrl } from "./_utils"

import type { IDataTableColumn } from "~/composables/useDataTable"
import type { INewsModel } from "~/src/types"
import type {INewsCreateParams} from "~/src/services/news"

definePageMeta({ middleware: "role-guard", requiredRole: "USER" })

const { t } = useI18n()
const { news: newsService, tags: tagsService } = useServices()
const toast = useToast()
const user = useSupabaseUser()
const columns: IDataTableColumn[] = [
    { key: "title", label: t("pages.admin.news.columns.title"), sortable: true },
    { key: "published", label: t("pages.admin.news.columns.status"), sortable: true, align: "center" },
    { key: "created_at", label: t("pages.admin.news.columns.date"), sortable: true, align: "right" },
]

type TabKey = "PUBLISHED" | "DRAFT" | "ALL"
const activeTab = ref<TabKey>("PUBLISHED")

// Form state
const showForm = ref(false)
const editingId = ref<number | null>(null)
const serverError = ref("")
const imageError = ref("")
const coverMode = ref<"UPLOAD" | "URL">("UPLOAD")
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
const { errors: formErrors, validate, validateField, isValid } = useFormValidation(form, {
    title: [required],
    slug: [required],
    content: [required, minLength(50)],
})
// el boton de save tambien necesita imagen, no solo los campos
const canSubmit = computed(() => {
    if (!isValid.value) return false
    return coverMode.value === "UPLOAD" ? !!selectedFile.value : !!form.image_url.trim()
})
const previewArticle = computed<INewsModel>(() => ({
    id: 0,
    title: form.title || t("pages.admin.news.form.previewTitle"),
    slug: form.slug || "ejemplo",
    content: "",
    excerpt: form.excerpt || null,
    image_url: coverMode.value === "UPLOAD" ? previewUrl.value || null : form.image_url || null,
    published: form.published,
    author_id: null,
    created_at: form.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
}))

// Data
const { data: articlesData, refresh } = await useAsyncData(
    "admin-news",
    () => newsService.fetchAll(),
)
const articles = computed(() => articlesData.value ?? [])

const { data: availableTagsData } = await useAsyncData("admin-news-tags", () => tagsService.listAll())
const availableTags = computed(() => availableTagsData.value ?? [])
const selectedTagIds = ref<number[]>([])
// al final no hara falta paginar, son 20-30 noticias como mucho. Si crece ya veremos.
const filtered = computed<INewsModel[]>(() => {
    const all = articles.value ?? []
    if (activeTab.value === "ALL") return all
    if (activeTab.value === "PUBLISHED") return all.filter(a => a.published)
    return all.filter(a => !a.published)
})

const counters = computed(() => {
    const all = articles.value ?? []
    const published = all.filter(a => a.published).length
    return { published, draft: all.length - published, total: all.length }
})

const tabs = computed(() => [
    { key: "PUBLISHED" as TabKey, labelKey: "pages.admin.news.tabs.published", count: counters.value.published },
    { key: "DRAFT"     as TabKey, labelKey: "pages.admin.news.tabs.draft",     count: counters.value.draft },
    { key: "ALL"       as TabKey, labelKey: "pages.admin.news.tabs.all",       count: counters.value.total },
])

const table = useDataTable<INewsModel>(filtered, {
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
    coverMode.value = "UPLOAD"
    selectedFile.value = null
    previewUrl.value = ""
    selectedTagIds.value = []
    showForm.value = true
}
async function editArticle(article: INewsModel) {
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
    coverMode.value = article.image_url ? "URL" : "UPLOAD"
    selectedFile.value = null
    previewUrl.value = ""
    selectedTagIds.value = []
    showForm.value = true

    // cargar tags actuales asincronamente; si falla el form sigue
    selectedTagIds.value = await tagsService.getTagIdsForNews(article.id)
}
function closeForm() {
    showForm.value = false
    editingId.value = null
    serverError.value = ""
    imageError.value = ""
}

async function saveArticle() {
    const fieldsOk = validate()
    const hasImage = coverMode.value === "UPLOAD" ? !!selectedFile.value : !!form.image_url.trim()
    imageError.value = hasImage ? "" : t("validations.required")
    if (!fieldsOk || !hasImage) return

    const { url: imageUrl, error: imgError } = await resolveImageUrl(
        coverMode.value, selectedFile.value, form.image_url, newsService.uploadImage.bind(newsService), form.slug.trim(),
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

    const targetId = editingId.value ?? (result.data as number | undefined) ?? null
    if (targetId != null) {
        const sync = await tagsService.syncForNews(targetId, selectedTagIds.value)
        if (sync.error) toast.error(sync.error)
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