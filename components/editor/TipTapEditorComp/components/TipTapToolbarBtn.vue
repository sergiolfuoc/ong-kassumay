<template>
    <button
        type="button"
        :title="title"
        :disabled="disabled"
        :class="btnClass"
        @click.prevent="onClick"
    >
        <span v-if="label" class="leading-none">{{ label }}</span>
        <component :is="icon" v-else-if="icon" class="w-5 h-5" />
    </button>

</template>
<script setup lang="ts">
import type { Component } from "vue"

const props = withDefaults(defineProps<{
    icon?: Component | null
    label?: string
    active?: boolean
    disabled?: boolean
    title?: string
}>(), { icon: null, label: "", active: false, disabled: false, title: "" })

const emit = defineEmits(["click"])

const btnClass = computed(() => [
    "w-9 h-9 rounded flex items-center justify-center text-sm font-bold transition",
    props.active ? "bg-primary-100 text-primary-700" : "text-earth-600 hover:bg-earth-100 hover:text-earth-800",
    props.disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer",
].join(" "))

function onClick() {
    if (props.disabled) return
    emit("click")
}
</script>
