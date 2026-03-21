<template>
    <StaticPageLayout :title="t('pages.legal.title')" :subtitle="t('pages.legal.organizationDescription')">
        <article class="space-y-10 text-earth-700">
            <section>
                <h2 class="text-xl font-display font-bold text-earth-900 mb-3">{{ t("pages.legal.website") }}</h2>
                <p class="leading-relaxed">{{ t("pages.legal.websiteDescription") }}</p>
            </section>

            <section>
                <h2 class="text-xl font-display font-bold text-earth-900 mb-3">{{ t("pages.legal.copyrightNotice") }}</h2>
                <p class="leading-relaxed">{{ t("pages.legal.copyrightNoticeDescription") }}</p>
                <ul class="mt-4 space-y-2 list-disc pl-5">
                    <li>{{ t("pages.legal.copyrightImages") }}</li>
                    <li>{{ t("pages.legal.copyrightCode") }}</li>
                </ul>
            </section>

            <section class="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 class="font-semibold text-earth-900 mb-2">{{ t("pages.legal.externalLinks") }}</h3>
                    <p class="text-sm leading-relaxed">{{ t("pages.legal.externalLinksDescription") }}</p>
                </div>
                <div>
                    <h3 class="font-semibold text-earth-900 mb-2">{{ t("pages.legal.liability") }}</h3>
                    <p class="text-sm leading-relaxed">{{ t("pages.legal.liabilityDescription") }}</p>
                </div>
            </section>

            <footer class="border-t border-earth-200 pt-6 text-sm text-earth-500">
                {{ t("pages.legal.contactDescription", { email: "contact@ong-senegal.org" }) }}
            </footer>
        </article>
    </StaticPageLayout>
</template>
<script setup lang="ts">
const { t } = useI18n()
useHead({ title: `${t("pages.legal.title")} - Fundació Kassumay` })
</script>
