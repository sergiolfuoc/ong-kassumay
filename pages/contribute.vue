<template>
    <StaticPageLayout :title="t('pages.contribute.title')" :subtitle="t('pages.contribute.intro')">
        <h2 style="font-size:1.5rem">{{ t("pages.contribute.chooseOption") }}</h2>

        <h2 style="font-size:1.2rem">{{ t("pages.contribute.donate.title") }}<span class="text-primary-500">*</span></h2>
        <p>{{ t("pages.contribute.donate.text") }}</p>
        <a
            :href="`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(t('pages.contribute.donate.title'))}`"
            class="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition no-underline"
        >
            {{ t("pages.contribute.donate.cta") }}
        </a>

        <h2 style="font-size:1.2rem">{{ t("pages.contribute.member.title") }}<span class="text-primary-500">*</span></h2>
        <p>{{ t("pages.contribute.member.text") }}</p>

        <h2 style="font-size:1.2rem">{{ t("pages.contribute.team.title") }}</h2>
        <p>{{ t("pages.contribute.team.text") }}</p>

        <h2 style="font-size:1.2rem">{{ t("pages.contribute.legacy.title") }}</h2>
        <p>{{ t("pages.contribute.legacy.text") }}</p>

        <h2 style="font-size:1.2rem">{{ t("pages.contribute.companies.title") }}<span class="text-primary-500">**</span></h2>
        <p>{{ t("pages.contribute.companies.text") }}</p>

        <form
            class="border border-earth-200 rounded-xl p-6 mt-10 not-prose space-y-5"
            @submit.prevent="handleSubmit"
        >
            <h3 class="text-sm font-semibold text-earth-700 tracking-wide">{{ t("pages.contribute.form.heading") }}</h3>

            <div>
                <label class="block text-xs font-semibold text-earth-700 mb-1">{{ t("pages.contribute.form.name") }} (*)</label>
                <input
                    v-model="formData.name"
                    type="text"
                    required
                    class="w-full bg-earth-50 border border-earth-300 rounded-md px-3 py-2.5 shadow-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-300 transition"
                />
            </div>

            <div>
                <label class="block text-xs font-semibold text-earth-700 mb-1">{{ t("pages.contribute.form.company") }}</label>
                <input
                    v-model="formData.company"
                    type="text"
                    class="w-full bg-earth-50 border border-earth-300 rounded-md px-3 py-2.5 shadow-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-300 transition"
                />
            </div>

            <div>
                <label class="block text-xs font-semibold text-earth-700 mb-1">{{ t("pages.contribute.form.email") }} (*)</label>
                <input
                    v-model="formData.email"
                    type="email"
                    required
                    class="w-full bg-earth-50 border border-earth-300 rounded-md px-3 py-2.5 shadow-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-300 transition"
                />
            </div>

            <div>
                <span class="block text-xs font-semibold text-earth-700 mb-2">{{ t("pages.contribute.form.want") }} (*)</span>
                <div class="flex flex-col gap-3 text-sm text-earth-700">
                    <label v-for="opt in interestOptions" :key="opt.key" class="flex items-center gap-2">
                        <input v-model="formData.interest" type="radio" :value="opt.label" required />
                        {{ opt.label }}
                    </label>
                </div>
            </div>

            <div>
                <textarea
                    v-model="formData.message"
                    rows="5"
                    class="w-full bg-earth-50 border border-earth-300 rounded-md px-3 py-2.5 shadow-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-300 transition"
                />
            </div>

            <button
                type="submit"
                class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded text-sm font-semibold transition"
            >
                {{ t("pages.contribute.form.send") }}
            </button>

            <p class="text-xs text-earth-500">{{ t("pages.contribute.form.requiredNote") }}</p>
        </form>

        <p class="text-xs text-primary-700 mt-10">
            <span class="text-primary-500">*</span> {{ t("pages.contribute.footnotes.individualPre") }}
            <strong>{{ t("pages.contribute.footnotes.individualBold") }}</strong>
            {{ t("pages.contribute.footnotes.individualPost") }}
        </p>

        <p class="text-xs text-primary-700">
            <span class="text-primary-500">**</span> {{ t("pages.contribute.footnotes.companiesPre") }}
            <strong>{{ t("pages.contribute.footnotes.companiesBold") }}</strong>
        </p>
    </StaticPageLayout>
</template>

<script setup lang="ts">
import { siteConfig } from "~/src/config/config"

const { t } = useI18n()

useHead({ title: `${t("pages.contribute.title")} - Fundació Kassumay` })

const interestOptions = computed(() => [
    { key: "volunteer", label: t("pages.contribute.form.options.volunteer") },
    { key: "member", label: t("pages.contribute.form.options.member") },
    { key: "collaborator", label: t("pages.contribute.form.options.collaborator") },
    { key: "other", label: t("pages.contribute.form.options.other") },
])

const formData = reactive({
    name: "",
    company: "",
    email: "",
    interest: "",
    message: "",
})

// Sin backend: redirige a un mailto con el cuerpo precompuesto.
function handleSubmit() {
    const labels = {
        name: t("pages.contribute.form.bodyLabels.name"),
        company: t("pages.contribute.form.bodyLabels.company"),
        email: t("pages.contribute.form.bodyLabels.email"),
        want: t("pages.contribute.form.bodyLabels.want"),
    }
    const body = [
        `${labels.name}: ${formData.name}`,
        `${labels.company}: ${formData.company || "-"}`,
        `${labels.email}: ${formData.email}`,
        `${labels.want}: ${formData.interest}`,
        "",
        formData.message,
    ].join("\n")

    const subject = t("pages.contribute.form.subject")
    const href = `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = href
}
</script>
