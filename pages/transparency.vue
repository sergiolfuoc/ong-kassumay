<template>
    <StaticPageLayout :title="t('pages.transparency.title')" :subtitle="t('pages.transparency.intro')">
        <div class="space-y-10">
            <section>
                <h2 class="text-xl font-display font-bold text-earth-900 mb-5">{{ t("pages.transparency.fundsBreakdown") }}</h2>
                <div class="space-y-4">
                    <div>
                        <div class="flex justify-between text-sm font-medium text-earth-700 mb-1">
                            <span>{{ t("pages.transparency.fundDirect") }}</span>
                            <span class="font-bold">78,4%</span>
                        </div>
                        <div class="w-full bg-earth-200 rounded h-2">
                            <div class="bg-primary-400 h-2 rounded" style="width: 78.4%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-sm font-medium text-earth-700 mb-1">
                            <span>{{ t("pages.transparency.fundOperations") }}</span>
                            <span class="font-bold">13,9%</span>
                        </div>
                        <div class="w-full bg-earth-200 rounded h-2">
                            <div class="bg-earth-400 h-2 rounded" style="width: 13.9%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-sm font-medium text-earth-700 mb-1">
                            <span>{{ t("pages.transparency.fundAdmin") }}</span>
                            <span class="font-bold">7,7%</span>
                        </div>
                        <div class="w-full bg-earth-200 rounded h-2">
                            <div class="bg-earth-300 h-2 rounded" style="width: 7.7%"></div>
                        </div>
                    </div>
                </div>
            </section>

            <div class="grid md:grid-cols-2 gap-4">
                <div class="rounded-xl border border-earth-200 bg-white p-6">
                    <h3 class="font-semibold text-earth-900 mb-2">{{ t("pages.transparency.financialReports") }}</h3>
                    <p class="text-sm text-earth-600">{{ t("pages.transparency.financialReportsDescription") }} <strong>contact@ong-senegal.org</strong>.</p>
                </div>
                <div class="rounded-xl border border-earth-200 bg-white p-6">
                    <h3 class="font-semibold text-earth-900 mb-2">{{ t("pages.transparency.payments") }}</h3>
                    <p class="text-sm text-earth-600">{{ t("pages.transparency.paymentsDescription") }}</p>
                </div>
            </div>

            <section class="rounded-xl bg-earth-50 border border-earth-200 px-6 py-5 text-center">
                <h3 class="font-semibold text-earth-900 mb-1">{{ t("pages.transparency.questions") }}</h3>
                <p class="text-sm text-earth-600">{{ t("pages.transparency.questionsDescription") }} <strong>contact@ong-senegal.org</strong>.</p>
            </section>
        </div>
    </StaticPageLayout>

</template>
<script setup lang="ts">

const { t } = useI18n()
useHead({ title: `${t("pages.transparency.title")} - Fundació Kassumay` })

</script>
