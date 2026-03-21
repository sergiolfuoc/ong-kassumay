<template>
    <div class="min-h-screen bg-earth-50">
        <section class="relative py-32 px-6 overflow-hidden">
            <div class="absolute inset-0 bg-[url('/images/heroes/oficina.avif')] bg-cover bg-center" />
            <!-- <div class="absolute inset-0 bg-kassumay-950/50" /> -->
            <div class="absolute inset-0 bg-emerald-950/50" />
            <div class="absolute inset-0 bg-black/55" />
            <div class="relative max-w-3xl mx-auto text-center">
                <h1 class="text-3xl md:text-4xl font-display font-bold text-white">{{ title }}</h1>
                <p v-if="subtitle" class="mt-4 text-earth-300 text-lg max-w-xl mx-auto">{{ subtitle }}</p>
            </div>
        </section>

        <div class="max-w-6xl mx-auto px-6 py-14">
            <div class="bg-white/80 rounded-2xl p-10 md:p-16 border border-earth-100">
                <div class="max-w-none text-earth-600 text-base leading-relaxed
                    [&>h2]:text-xl [&>h2]:font-display [&>h2]:font-bold [&>h2]:text-earth-900 [&>h2]:mt-14 [&>h2]:mb-5
                    [&>p]:mb-7
                    [&>ul]:my-8 [&>ul]:space-y-4 [&>ul]:list-disc [&>ul]:pl-6
                    [&>ul>li]:text-earth-600 [&>ul>li]:leading-relaxed
                    [&_strong]:text-earth-800 [&_strong]:font-semibold">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>
