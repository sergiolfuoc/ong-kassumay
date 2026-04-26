<template>
    <input
        :value="modelValue ?? ''"
        :type="type"
        :min="min"
        :max="max"
        :step="step"
        :placeholder="placeholder"
        class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        :class="hasError ? 'border-red-400 ring-1 ring-red-400' : ''"
        @input="onInput"
        @blur="$emit('blur')"
    />

</template>
<script setup lang="ts">
const props = defineProps<{
    modelValue: string | number | null | undefined
    type?: "text" | "number" | "date" | "url" | "email"
    placeholder?: string
    min?: number | string
    max?: number | string
    step?: number | string
    hasError?: boolean
}>()

const emit = defineEmits(["update:modelValue", "blur"])

function onInput(ev: Event) {
    const target = ev.target as HTMLInputElement
    if (props.type === "number") {
        emit("update:modelValue", target.value === "" ? null : Number(target.value))
    } else {
        emit("update:modelValue", target.value)
    }
}
</script>
