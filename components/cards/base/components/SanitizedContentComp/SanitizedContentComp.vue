<template>
    <div class="prose prose-lg max-w-none text-earth-700 prose-headings:text-earth-900 prose-a:text-primary-500" v-html="sanitized" />
</template>

<script setup lang="ts">
import DOMPurify from "isomorphic-dompurify"

const props = defineProps<{ html: string }>()
const sanitized = computed(() => (props.html ? DOMPurify.sanitize(props.html) : ""))
</script>
