<template>
    <span class="px-2 py-1 rounded-full text-xs font-semibold" :class="colorClasses">
        <slot>{{ label }}</slot>
    </span>
</template>

<script setup lang="ts">
type Variant = "published" | "draft" | "active" | "inactive"

const props = defineProps<{
    variant: Variant
    label?: string
}>()

const colorClasses = computed(() => {
    switch (props.variant) {
        case "published":
        case "active":
            return "bg-green-100 text-green-800"
        case "draft":
        case "inactive":
            return "bg-yellow-100 text-yellow-800"
    }
})
</script>
