<template>
    <dialog ref="dialogRef" class="backdrop:bg-black/50 bg-transparent p-0 w-full max-w-4xl" @close="$emit('close')">
        <div
            class="relative bg-white rounded-xl shadow-xl p-6 w-full max-h-[90vh] overflow-y-auto border-4"
            :class="props.form.active ? 'border-transparent' : 'border-amber-400/80'"
        >
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-bold text-earth-900">
                    {{ props.editingId ? t("pages.admin.campaigns.editTitle") : t("pages.admin.campaigns.createTitle") }}
                </h2>
                <button class="text-earth-400 hover:text-earth-700 text-2xl leading-none" @click="$emit('close')">&times;</button>
            </div>
            <div class="space-y-5">
                <!-- nota: probe a unificar estos inputs con el FormFieldComp/FormInputComp de NewsForm -->
                <!-- pero las fechas necesitan min/max dinamico (end_date >= start_date) y la meta      -->
                <!-- numerica con preview no entraba limpia en el base. mantenidos (separados) a proposito. -->

                <!-- Fechas  -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-earth-700 mb-1">{{ t("pages.admin.campaigns.form.startDate") }}</label>
                        <input
                            v-model="props.form.start_date"
                            type="date"
                            class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            :class="props.errors.start_date ? 'border-red-400' : 'border-earth-300'"
                            @blur="$emit('field-touched', 'start_date')"
                        />
                        <p v-if="props.errors.start_date" class="text-red-500 text-xs mt-1">{{ t(props.errors.start_date) }}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-earth-700 mb-1">{{ t("pages.admin.campaigns.form.endDate") }}</label>
                        <input
                            v-model="props.form.end_date"
                            type="date"
                            :min="props.form.start_date || undefined"
                            class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            :class="props.errors.end_date ? 'border-red-400' : 'border-earth-300'"
                            @blur="$emit('field-touched', 'end_date')"
                        />
                        <p v-if="props.errors.end_date" class="text-red-500 text-xs mt-1">{{ t(props.errors.end_date) }}</p>
                    </div>
                </div>

                <!-- Meta y recaudado -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-earth-700 mb-1">{{ t("pages.admin.campaigns.form.goalAmount") }}</label>
                        <input
                            v-model.number="props.form.goal_amount"
                            type="number"
                            min="0"
                            step="1"
                            class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            :class="props.errors.goal_amount ? 'border-red-400' : 'border-earth-300'"
                            @blur="$emit('field-touched', 'goal_amount')"
                        />
                        <p v-if="props.errors.goal_amount" class="text-red-500 text-xs mt-1">{{ t(props.errors.goal_amount, { min: 1 }) }}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-earth-700 mb-1">{{ t("pages.admin.campaigns.form.raisedAmount") }}</label>
                        <input
                            v-model.number="props.form.raised_amount"
                            type="number"
                            min="0"
                            step="1"
                            class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            :class="props.errors.raised_amount ? 'border-red-400' : 'border-earth-300'"
                            @blur="$emit('field-touched', 'raised_amount')"
                        />
                        <p v-if="props.errors.raised_amount" class="text-red-500 text-xs mt-1">{{ t(props.errors.raised_amount, { min: 0 }) }}</p>
                    </div>
                </div>

                <!-- Titulo y Slug -->
                <div class="grid grid-cols-2 gap-4">
                    <FormFieldComp :label="t('pages.admin.campaigns.form.title')" :error="props.errors.title ? t(props.errors.title) : ''">
                        <template #default="{ hasError }">
                            <FormInputComp
                                v-model="props.form.title"
                                :has-error="hasError"
                                @update:model-value="$emit('slug-from-title')"
                                @blur="$emit('field-touched', 'title')"
                            />
                        </template>
                    </FormFieldComp>
                    <FormFieldComp :label="t('pages.admin.campaigns.form.slug')" :error="props.errors.slug ? t(props.errors.slug) : ''">
                        <template #default="{ hasError }">
                            <FormInputComp
                                v-model="props.form.slug"
                                :has-error="hasError"
                                @blur="$emit('field-touched', 'slug')"
                            />
                        </template>
                    </FormFieldComp>
                </div>

                <!-- Descripcion campaña (lo mas pesado antes de la preview) -->
                <fieldset class="border border-earth-200 rounded-lg p-4 space-y-3" :class="props.errors.description ? 'border-red-400' : ''">
                    <legend class="text-sm font-semibold text-earth-600 px-2">{{ t("pages.admin.campaigns.form.descriptionSection") }}</legend>
                    <TipTapEditorComp v-model="props.form.description" @blur="$emit('field-touched', 'description')" />
                    <p v-if="props.errors.description" class="text-red-500 text-xs mt-1">{{ t(props.errors.description, { min: 10 }) }}</p>
                </fieldset>

                <!-- Tarjeta (preview) -->
                <fieldset class="border border-earth-200 rounded-lg p-4">
                    <legend class="text-sm font-semibold text-earth-600 px-2">{{ t("pages.admin.campaigns.form.cardSection") }}</legend>
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
                                        {{ t("pages.admin.campaigns.form.imageUpload") }}
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
                                        {{ t("pages.admin.campaigns.form.imagePasteUrl") }}
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
                                        {{ t("pages.admin.campaigns.form.removeImage") }}
                                    </button>
                                </div>
                                <p v-if="props.imageError" class="text-red-500 text-xs mt-1">{{ props.imageError }}</p>
                            </div>
                            <FormFieldComp :label="t('pages.admin.campaigns.form.excerpt')">
                                <FormTextareaComp v-model="props.form.excerpt" rows="6" />
                            </FormFieldComp>
                        </div>
                        <div class="pointer-events-none">
                            <p class="text-xs text-earth-400 mb-2">{{ t("pages.admin.campaigns.form.cardPreview") }}</p>
                            <CampaignCardComp :campaign="props.previewCampaign" />
                        </div>
                    </div>
                </fieldset>

                <!-- Tags -->
                <fieldset class="border border-earth-200 rounded-lg p-4">
                    <legend class="text-sm font-semibold text-earth-600 px-2">{{ t("pages.admin.campaigns.form.tagsSection") }}</legend>
                    <TagsFieldComp
                        :tags="props.availableTags"
                        :model-value="props.tagIds"
                        @update:model-value="$emit('update:tagIds', $event)"
                    />
                </fieldset>

                <!-- Actions -->
                <div class="flex items-center gap-2">
                    <input id="active" v-model="props.form.active" type="checkbox" class="rounded" />
                    <label for="active" class="text-sm text-earth-700">{{ t("pages.admin.campaigns.form.active") }}</label>
                </div>
                <FormModalActionsComp
                    :save-label="t('pages.admin.campaigns.form.save')"
                    :cancel-label="t('pages.admin.campaigns.form.cancel')"
                    :server-error="props.serverError"
                    :disabled="!props.canSubmit"
                    @cancel="$emit('close')"
                    @save="$emit('save')"
                />
            </div>
        </div>
    </dialog>

</template>
<script setup lang="ts">
import type { ICampaignModel, ITagModel } from "~/src/types"
const { t } = useI18n()

const props = defineProps<{
    visible: boolean
    editingId: number | null
    form: {
        title: string
        slug: string
        description: string
        excerpt: string
        image_url: string
        goal_amount: number | null
        raised_amount: number
        start_date: string
        end_date: string
        active: boolean
    }
    coverMode: "UPLOAD" | "URL"
    selectedFile: File | null
    previewCampaign: ICampaignModel
    availableTags: ITagModel[]
    tagIds: number[]
    errors: Record<string, string>
    imageError: string
    serverError: string
    canSubmit: boolean
}>()

const emit = defineEmits(["close", "save", "slug-from-title", "update:coverMode", "update:tagIds", "picked-image", "clear-file", "field-touched"])

const fileInput = ref<HTMLInputElement | null>(null)
const dialogRef = ref<HTMLDialogElement | null>(null)

// abrir/cerrar el <dialog> nativo segun el prop visible
watch(() => props.visible, (v) => {
    const d = dialogRef.value
    if (!d) return
    if (v && !d.open) d.showModal()
    if (!v && d.open) d.close()
})

function onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0] ?? null
    console.log("[CampaignForm] picked image", file?.name, file?.size)
    emit("picked-image", file)
}
const clearFile = () => {
    emit("clear-file")
    if (fileInput.value) fileInput.value.value = ""
}

</script>