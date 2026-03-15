<template>
    <footer :class="design.footer">
        <div :class="design.footerGrid">
            <div>
                <div :class="design.brandRow">
                    <div :class="design.brandIconWrap">
                        <BrandHeartIcon :size="16" class="text-white" />
                    </div>
                    <span :class="design.brandText">{{ $t("components.layouts.AppFooterLayout.brand") }}</span>
                </div>
                <p :class="design.brandDescription">
                    {{ $t("components.layouts.AppFooterLayout.brandDescription") }}
                </p>
                <div v-if="socialLinks.length" :class="design.socialRow">
                    <a
                        v-for="link in socialLinks"
                        :key="link.label"
                        :href="link.url"
                        target="_blank"
                        rel="noopener"
                        :class="design.socialLink"
                        :aria-label="link.label"
                    >
                        <component :is="link.icon" :class="design.socialIcon" />
                    </a>
                </div>
            </div>

            <div>
                <h4 :class="design.sectionTitle">{{ $t("components.layouts.AppFooterLayout.navigation") }}</h4>
                <ul :class="design.sectionList">
                    <li>
                        <NuxtLink to="/" :class="design.footerLink">{{ $t("composables.useNavigation.home") }}</NuxtLink>
                    </li>
                </ul>
            </div>

            <div>
                <h4 :class="design.sectionTitle">{{ $t("components.layouts.AppFooterLayout.howToHelp") }}</h4>
                <ul :class="design.sectionList">
                    <li>
                        <NuxtLink to="/register" :class="design.footerLink">{{ $t("composables.useNavigation.signUp") }}</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/login" :class="design.footerLink">{{ $t("composables.useNavigation.signIn") }}</NuxtLink>
                    </li>
                </ul>
            </div>

            <div>
                <h4 :class="design.sectionTitle">{{ $t("components.layouts.AppFooterLayout.contact") }}</h4>
                <ul :class="design.sectionList">
                    <li :class="design.contactRow">
                        <MapPinIcon icon-class="w-4 h-4 mt-0.5 shrink-0 text-primary-400" />
                        <span>Dakar, Senegal</span>
                    </li>
                    <li v-if="contactEmail" :class="design.contactRow">
                        <EnvelopeIcon icon-class="w-4 h-4 mt-0.5 shrink-0 text-primary-400" />
                        <a :href="`mailto:${contactEmail}`" :class="design.footerLink">{{ contactEmail }}</a>
                    </li>
                </ul>
            </div>
        </div>

        <div :class="design.bottomBar">
            <div :class="design.bottomBarInner">
                <p>{{ $t("components.layouts.AppFooterLayout.copyright", { year: new Date().getFullYear() }) }}</p>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { siteConfig } from "~/src/config/config"

const contactEmail = computed(() => siteConfig.contactEmail || "contact@ong-senegal.org")

const socialLinks = computed(() => {
    const links = [] as { label: string; url: string; icon: ReturnType<typeof resolveComponent> }[]

    if (siteConfig.socialLinks.youtube) {
        links.push({
            label: "YouTube",
            url: siteConfig.socialLinks.youtube,
            icon: resolveComponent("YoutubeIcon"),
        })
    }

    return links
})

const design = {
    footer: "bg-earth-900 text-earth-300",
    footerGrid: "max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10",
    brandRow: "flex items-center gap-2.5 mb-4",
    brandIconWrap: "w-9 h-9 bg-primary-400 rounded-full flex items-center justify-center",
    brandText: "text-lg font-bold text-white",
    brandDescription: "text-sm text-earth-400 leading-relaxed",
    socialRow: "flex gap-3 mt-5",
    socialLink: "w-9 h-9 rounded-full bg-earth-800 hover:bg-primary-400 flex items-center justify-center transition",
    socialIcon: "w-4 h-4 text-earth-400 hover:text-white",
    sectionTitle: "text-white font-semibold mb-5 text-sm",
    sectionList: "space-y-3 text-sm",
    footerLink: "hover:text-primary-400 transition",
    contactRow: "flex items-start gap-2",
    bottomBar: "border-t border-earth-800",
    bottomBarInner: "max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-earth-500",
}
</script>
