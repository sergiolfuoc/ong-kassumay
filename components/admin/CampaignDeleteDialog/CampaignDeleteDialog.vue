<template>
    <Teleport v-if="target" to="body">
        <div class="fixed inset-0 z-50 flex items-center justify-center">
            <div class="absolute inset-0 bg-black/50" @click="emit('cancel')" />
            <div class="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
                <h3 class="text-lg font-bold text-earth-900 mb-2">{{ t("pages.admin.campaigns.deleteDialog.title") }}</h3>
                <p class="text-sm text-earth-600 mb-3">
                    {{ t("pages.admin.campaigns.deleteDialog.body", { title: target.title }) }}
                </p>
                <input
                    v-model="confirmText"
                    type="text"
                    class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    :placeholder="target.title"
                />
                <div class="flex justify-end gap-2 mt-4">
                    <button class="px-4 py-2 text-sm rounded-lg border border-earth-300 text-earth-700 hover:bg-earth-50" @click="emit('cancel')">
                        {{ t("pages.admin.campaigns.form.cancel") }}
                    </button>
                    <button
                        class="px-4 py-2 text-sm rounded-lg bg-red-600 text-white font-semibold disabled:opacity-50 hover:bg-red-700"
                        :disabled="confirmText !== target.title"
                        @click="emit('confirm')"
                    >
                        {{ t("pages.admin.campaigns.deleteDialog.confirm") }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>

</template>
<script setup lang="ts">
import type { ICampaignModel } from "~/src/types"

const { t } = useI18n()

const props = defineProps<{ target: ICampaignModel | null }>()
const emit = defineEmits<{
    cancel: []
    confirm: []
}>()

// cuando target cambia se resetea (limpiado)
const confirmText = ref("")
watch(() => props.target?.id, () => { confirmText.value = "" })

</script>