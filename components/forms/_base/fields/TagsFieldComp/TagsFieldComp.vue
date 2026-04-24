<template>
    <div v-if="!tags.length" class="text-xs text-earth-400">
        {{ t("components.forms.TagsFieldComp.empty") }}
    </div>
    <div v-else class="flex flex-wrap gap-2">
        <button
            v-for="tag in tags"
            :key="tag.id"
            type="button"
            class="px-3 py-1 text-xs rounded-full border transition select-none"
            :class="modelValue.includes(tag.id)
                ? 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700'
                : 'bg-white text-earth-600 border-earth-300 hover:bg-earth-50'"
            @click="toggle(tag.id)">
            {{ tag.name }}
        </button>
    </div>

</template>
<script setup lang="ts">
import type { ITagModel } from "~/src/types"

const { t } = useI18n()

const props = defineProps<{
    tags: ITagModel[]
    modelValue: number[]
}>()

const emit = defineEmits<{ (e: "update:modelValue", value: number[]): void }>()
function toggle(id: number) {
    if (props.modelValue.includes(id)) {
        emit("update:modelValue", props.modelValue.filter(x => x !== id))
    } else {
        emit("update:modelValue", [...props.modelValue, id])
    }
}
</script>