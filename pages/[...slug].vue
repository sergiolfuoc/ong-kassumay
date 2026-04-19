<script setup lang="ts">
definePageMeta({
    // Evitar que corran middlewares globales (auth, etc.) en este catch-all.
    middleware: [],
})

if (import.meta.server) {
    await navigateTo("/", { redirectCode: 302, replace: true })
}
else {
    window.location.replace("/")
}
</script>

<template>
    <div />
</template>
