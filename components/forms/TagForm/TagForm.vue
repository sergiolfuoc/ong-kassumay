<template>
    <Teleport to="body">
        <div v-if="props.visible" class="fixed inset-0 z-50 flex items-center justify-center">
            <div class="absolute inset-0 bg-black/50" @click="$emit('close')" />
            <div class="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-bold text-earth-900">
                        {{ props.editingId ? t("pages.admin.tags.editTitle") : t("pages.admin.tags.createTitle") }}
                    </h2>
                    <button class="text-earth-400 hover:text-earth-700 text-2xl leading-none" @click="$emit('close')">&times;</button>
                </div>

                <div class="space-y-4">
                    <FormFieldComp
                        :label="t('pages.admin.tags.form.name')"
                        :error="props.errors.name ? t(props.errors.name) : ''"
                    >
                        <template #default="{ hasError }">
                            <FormInputComp
                                v-model="props.form.name"
                                :has-error="hasError"
                                @update:model-value="$emit('auto-slug')"
                                @blur="$emit('field-touched', 'name')"
                            />
                        </template>
                    </FormFieldComp>

                    <FormFieldComp
                        :label="t('pages.admin.tags.form.slug')"
                        :error="props.errors.slug ? t(props.errors.slug) : ''"
                    >
                        <template #default="{ hasError }">
                            <FormInputComp
                                v-model="props.form.slug"
                                :has-error="hasError"
                                @blur="$emit('field-touched', 'slug')"
                            />
                        </template>
                    </FormFieldComp>
                </div>

                <FormModalActionsComp
                    class="mt-6"
                    :save-label="t('pages.admin.tags.form.save')"
                    :cancel-label="t('pages.admin.tags.form.cancel')"
                    :server-error="props.serverError"
                    :disabled="!props.canSubmit"
                    @cancel="$emit('close')"
                    @save="$emit('save')"
                />
            </div>
        </div>
    </Teleport>

</template>
<script setup lang="ts">
const { t } = useI18n()

const props = defineProps<{
    visible: boolean
    editingId: number | null
    form: { name: string; slug: string }
    errors: Record<string, string>
    serverError: string
    canSubmit: boolean
}>()

defineEmits(["close", "save", "auto-slug", "field-touched"])
</script>
