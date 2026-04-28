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

            <section>
                <h2 class="text-xl font-display font-bold text-earth-900 mb-3">{{ t("pages.foundation.transparency.title") }}</h2>
                <p class="leading-relaxed">{{ t("pages.foundation.transparency.legalIntro") }}</p>

                <ul class="mt-4 space-y-2 list-disc pl-5">
                    <li v-for="law in laws" :key="law.key">
                        <a :href="law.url" target="_blank" rel="noopener" class="text-primary-600 hover:text-primary-700 underline">
                            {{ t(`pages.foundation.transparency.laws.${law.key}`) }}
                        </a>
                    </li>
                </ul>

                <p class="leading-relaxed mt-4">
                    {{ t("pages.foundation.transparency.amlPre") }}
                    <a :href="amlUrl" target="_blank" rel="noopener" class="text-primary-600 hover:text-primary-700 underline">
                        {{ t("pages.foundation.transparency.amlLink") }}
                    </a>
                    {{ t("pages.foundation.transparency.amlPost") }}
                </p>
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

const laws = [
    { key: "law1", url: "http://dogc.gencat.cat/ca/pdogc_canals_interns/pdogc_resultats_fitxa/?documentId=490798&language=ca_ES&action=fitxa" },
    { key: "law2", url: "http://portaldogc.gencat.cat/utilsEADOP/PDF/6152/1248505.pdf" },
    { key: "law3", url: "https://portaljuridic.gencat.cat/ca/pjur_ocults/pjur_resultats_fitxa/?action=fitxa&documentId=826623&language=ca_ES&textWords=JUS%2F152%2F2018&mode=single" },
    { key: "law4", url: "http://justicia.gencat.cat/web/.content/documents/publicacions/colleccions/llei_protectorat_96.pdf" },
    { key: "law5", url: "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2002-25039" },
]

const amlUrl = "https://www.boe.es/buscar/act.php?id=BOE-A-2010-6737"
</script>
