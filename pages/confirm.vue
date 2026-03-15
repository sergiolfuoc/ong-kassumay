<template>
    <div class="min-h-screen flex items-center justify-center bg-earth-50 px-4">
        <!-- Spinner -->
        <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-400/20 flex items-center justify-center">
                <SpinnerIcon icon-class="w-8 h-8 text-primary-400" />
            </div>
            <h1 class="text-2xl font-bold text-earth-900 mb-2">{{ $t("pages.confirm.title") }}</h1>
            <p class="text-earth-400">{{ $t("pages.confirm.subtitle") }}</p>
        </div>
    </div>
</template>
<script setup lang="ts">
definePageMeta({ layout: false })
const user = useSupabaseUser()

// Supabase handles the confirmation token from URL automatically
watch(
    user,
    (newUser) => {
        if (newUser) {
            navigateTo("/")
        }
    },
    { immediate: true }
)
</script>
