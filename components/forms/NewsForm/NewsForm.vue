<template>
    <Teleport to="body">
        <div v-if="props.visible" class="fixed inset-0 z-50 flex items-center justify-center">
            <div class="absolute inset-0 bg-black/50" @click="$emit('close')" />
            <div
                class="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4 border-4"
                :class="props.form.published ? 'border-transparent' : 'border-amber-400/80'"
            >
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-bold text-earth-900">
                        {{ props.editingId ? t("pages.admin.news.editTitle") : t("pages.admin.news.createTitle") }}
                    </h2>
                    <button class="text-earth-400 hover:text-earth-700 text-2xl leading-none" @click="$emit('close')">&times;</button>
                </div>
                <div class="space-y-5">
                    <!-- Titulo y Slug -->
                    <div class="grid grid-cols-2 gap-4">
                        <FormFieldComp :label="t('pages.admin.news.form.title')" :error="props.errors.title ? t(props.errors.title) : ''">
                            <template #default="{ hasError }">
                                <FormInputComp v-model="props.form.title" :has-error="hasError" @update:model-value="$emit('auto-slug')" />
                            </template>
                        </FormFieldComp>
                        <FormFieldComp :label="t('pages.admin.news.form.slug')" :error="props.errors.slug ? t(props.errors.slug) : ''">
                            <template #default="{ hasError }">
                                <FormInputComp v-model="props.form.slug" :has-error="hasError" />
                            </template>
                        </FormFieldComp>
                    </div>

                    <!-- Fecha de publicacion -->
                    <FormFieldComp :label="t('pages.admin.news.form.publishDate')">
                        <FormInputComp v-model="props.form.created_at" type="date" :max="today" />
                    </FormFieldComp>

                    <!-- Tarjeta (preview) -->
                    <fieldset class="border border-earth-200 rounded-lg p-4">
                        <legend class="text-sm font-semibold text-earth-600 px-2">{{ t("pages.admin.news.form.cardSection") }}</legend>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-3">
                                <div>
                                    <div class="flex gap-1 mb-2">
                                        <button
                                            type="button"
                                            class="px-3 py-1 text-xs rounded-lg border transition"
                                            :class="
                                                props.coverMode === 'UPLOAD'
                                                    ? 'bg-primary-600 text-white border-primary-600'
                                                    : 'bg-white text-earth-600 border-earth-300 hover:bg-earth-50'
                                            "
                                            @click="$emit('update:coverMode', 'UPLOAD')"
                                        >
                                            {{ t("pages.admin.news.form.imageUpload") }}
                                        </button>
                                        <button
                                            type="button"
                                            class="px-3 py-1 text-xs rounded-lg border transition"
                                            :class="
                                                props.coverMode === 'URL'
                                                    ? 'bg-primary-600 text-white border-primary-600'
                                                    : 'bg-white text-earth-600 border-earth-300 hover:bg-earth-50'
                                            "
                                            @click="$emit('update:coverMode', 'URL')"
                                        >
                                            {{ t("pages.admin.news.form.imagePasteUrl") }}
                                        </button>
                                    </div>
                                    <FormInputComp v-if="props.coverMode === 'URL'" v-model="props.form.image_url" placeholder="https://..." :has-error="!!props.imageError" />
                                    <div v-else>
                                        <input
                                            ref="fileInput"
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            class="w-full text-sm text-earth-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100"
                                            @change="onFileSelected"
                                        />
                                        <button v-if="props.selectedFile" type="button" class="mt-1 text-xs text-red-500 hover:text-red-700" @click="clearFile">
                                            {{ t("pages.admin.news.form.removeImage") }}
                                        </button>
                                    </div>
                                    <p v-if="props.imageError" class="text-red-500 text-xs mt-1">{{ props.imageError }}</p>
                                </div>
                                <FormFieldComp :label="t('pages.admin.news.form.excerpt')">
                                    <FormTextareaComp v-model="props.form.excerpt" rows="6" />
                                </FormFieldComp>
                            </div>
                            <div class="pointer-events-none">
                                <p class="text-xs text-earth-400 mb-2">{{ t("pages.admin.news.form.cardPreview") }}</p>
                                <NewsCardComp :article="props.previewArticle" />
                            </div>
                        </div>
                    </fieldset>

                    <!-- Contenido noticia -->
                    <fieldset class="border border-earth-200 rounded-lg p-4 space-y-3" :class="props.errors.content ? 'border-red-400' : ''">
                        <legend class="text-sm font-semibold text-earth-600 px-2">{{ t("pages.admin.news.form.articleSection") }}</legend>
                        <TipTapEditorComp v-model="props.form.content" />
                        <p v-if="props.errors.content" class="text-red-500 text-xs mt-1">{{ t(props.errors.content, { min: 10 }) }}</p>
                    </fieldset>

                    <!-- Actions -->
                    <div class="flex items-center gap-2">
                        <input id="published" v-model="props.form.published" type="checkbox" class="rounded" />
                        <label for="published" class="text-sm text-earth-700">{{ t("pages.admin.news.form.published") }}</label>
                    </div>
                    <FormModalActionsComp
                        :save-label="t('pages.admin.news.form.save')"
                        :cancel-label="t('pages.admin.news.form.cancel')"
                        :server-error="props.serverError"
                        @cancel="$emit('close')"
                        @save="$emit('save')"
                    />
                </div>
            </div>
        </div>
    </Teleport>

</template>
<script setup lang="ts">
import type { INewsModel } from "~/src/types"

const today = new Date().toISOString().slice(0, 10)
const { t } = useI18n()

const props = defineProps<{
    visible: boolean
    editingId: number | null
    form: {
        title: string
        slug: string
        created_at: string
        content: string
        excerpt: string
        image_url: string
        published: boolean
    }
    coverMode: "UPLOAD" | "URL"
    selectedFile: File | null
    previewArticle: INewsModel
    errors: Record<string, string>
    imageError: string
    serverError: string
}>()

const emit = defineEmits(["close", "save", "auto-slug", "update:coverMode", "file-selected", "clear-file"])

const fileInput = ref<HTMLInputElement | null>(null)

function onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0] ?? null
    emit("file-selected", file)
}
const clearFile = () => {
    emit("clear-file")
    if (fileInput.value) fileInput.value.value = ""
}
</script>
