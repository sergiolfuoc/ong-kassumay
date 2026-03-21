<template>
    <StaticPageLayout :title="t('pages.privacy.title')" :subtitle="t('pages.privacy.intro')">
        <div class="space-y-3">
            <StaticAccordionItem :title="t('pages.privacy.infoCollect')">
                <p>{{ t("pages.privacy.infoCollectDescription") }}</p>
                <ul class="mt-4 space-y-2 list-disc pl-5">
                    <li><strong>{{ t("pages.privacy.personalData") }}</strong>: {{ t("pages.privacy.personalDataDescription") }}</li>
                    <li><strong>{{ t("pages.privacy.usageData") }}</strong>: {{ t("pages.privacy.usageDataDescription") }}</li>
                    <li><strong>{{ t("pages.privacy.donationData") }}</strong>: {{ t("pages.privacy.donationDataDescription") }}</li>
                </ul>
            </StaticAccordionItem>

            <StaticAccordionItem :title="t('pages.privacy.howWeUse')">
                <ul class="space-y-2 list-disc pl-5">
                    <li>{{ t("pages.privacy.useReceipts") }}</li>
                    <li>{{ t("pages.privacy.useCommunicate") }}</li>
                    <li>{{ t("pages.privacy.useImprove") }}</li>
                </ul>
            </StaticAccordionItem>

            <StaticAccordionItem :title="t('pages.privacy.dataProtection')">
                <p>{{ t("pages.privacy.dataProtectionDescription") }}</p>
            </StaticAccordionItem>

            <StaticAccordionItem :title="t('pages.privacy.yourRights')">
                <p>{{ t("pages.privacy.yourRightsDescription", { email: "contact@ong-senegal.org" }) }}</p>
            </StaticAccordionItem>

            <StaticAccordionItem :title="t('pages.privacy.contact')">
                <p>{{ t("pages.privacy.contactDescription", { email: "contact@ong-senegal.org" }) }}</p>
            </StaticAccordionItem>
        </div>
    </StaticPageLayout>

</template>
<script setup lang="ts">

const { t } = useI18n()
useHead({ title: `${t("pages.privacy.title")} - Fundació Kassumay` })

</script>
