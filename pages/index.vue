<template>
    <div>
        <!-- hero -->
        <section class="relative min-h-[90vh] flex items-center overflow-hidden">
            <div class="absolute inset-0 bg-[url('/images/heroes/home-hero.jpg')] bg-cover bg-center" />
            <div class="absolute inset-0 bg-gradient-to-r from-earth-950/80 via-earth-950/60 to-earth-950/30" />
            <div class="relative max-w-7xl mx-auto px-6 py-20 w-full">
                <div class="max-w-2xl">
                    <span
                        class="inline-flex items-center gap-2 bg-primary-400/20 text-primary-300 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6 backdrop-blur-sm border border-primary-400/20"
                    >
                        <BrandHeartIcon :size="16" class="text-primary-300" />
                        {{ t("pages.index.hero.tag") }}
                    </span>
                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight" v-html="t('pages.index.hero.title', { br: '<br/>' })" />
                    <p class="text-warm-200 text-lg md:text-xl mt-6 leading-relaxed max-w-lg">
                        {{ t("pages.index.hero.subtitle") }}
                    </p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
