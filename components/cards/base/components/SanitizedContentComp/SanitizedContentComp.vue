<template>
    <div class="sanitized-content text-earth-700" v-html="sanitized" />
</template>

<script setup lang="ts">
import DOMPurify from "isomorphic-dompurify"

const props = defineProps<{ html: string }>()
const sanitized = computed(() => (props.html ? DOMPurify.sanitize(props.html) : ""))
</script>

<style scoped>
/* Estilos minimos sin @tailwindcss/typography (no instalado): */
.sanitized-content :deep(p) {
    margin: 0 0 1em 0;
    line-height: 1.65;
    white-space: pre-wrap; 
}
.sanitized-content :deep(p:last-child) { margin-bottom: 0; }
.sanitized-content :deep(br) { display: block; content: ""; margin-top: 0.5em; }
.sanitized-content :deep(h1),
.sanitized-content :deep(h2),
.sanitized-content :deep(h3) {
    color: #2c241d; /* earth-900 aprox */
    font-weight: 700;
    margin: 1.5em 0 0.5em;
    line-height: 1.25;
}
.sanitized-content :deep(h1) { font-size: 1.875rem; }
.sanitized-content :deep(h2) { font-size: 1.5rem; }
.sanitized-content :deep(h3) { font-size: 1.25rem; }
.sanitized-content :deep(ul),
.sanitized-content :deep(ol) {
    margin: 0 0 1em 1.5em;
    padding-left: 1rem;
}
.sanitized-content :deep(ul) { list-style: disc; }
.sanitized-content :deep(ol) { list-style: decimal; }
.sanitized-content :deep(li) { margin-bottom: 0.25em; }
.sanitized-content :deep(a) {
    color: var(--tw-prose-links, #16a34a);
    text-decoration: underline;
}
.sanitized-content :deep(strong) { font-weight: 700; color: #2c241d; }
.sanitized-content :deep(img) { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1em 0; }
.sanitized-content :deep(blockquote) {
    border-left: 3px solid #d6d3d1;
    padding-left: 1rem;
    color: #57534e;
    margin: 1em 0;
}
</style>
