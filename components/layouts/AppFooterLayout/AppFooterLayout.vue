<template>
    <footer class="bg-earth-900 text-earth-300">
        <div class="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div>
                <div class="flex items-center gap-2.5 mb-4">
                    <div class="w-9 h-9 bg-primary-400 rounded-full flex items-center justify-center">
                        <BrandHeartIcon icon-class="w-4 h-4" class="text-white" />
                    </div>
                    <span class="text-lg font-bold text-white">{{ $t("components.layouts.AppFooterLayout.brand") }}</span>
                </div>
                <p class="text-sm text-earth-400 leading-relaxed">
                    {{ $t("components.layouts.AppFooterLayout.brandDescription") }}
                </p>
                <div v-if="socialLinks.length" class="flex gap-3 mt-5">
                    <a
                        v-for="link in socialLinks"
                        :key="link.label"
                        :href="link.url"
                        target="_blank"
                        rel="noopener"
                        class="w-9 h-9 rounded-full bg-earth-800 hover:bg-primary-400 flex items-center justify-center transition"
                        :aria-label="link.label"
                    >
                        <component :is="link.icon" class="w-4 h-4 text-earth-400 hover:text-white" />
                    </a>
                </div>
            </div>

            <div>
                <h4 class="text-white font-semibold mb-5 text-sm">{{ $t("components.layouts.AppFooterLayout.contact") }}</h4>
                <ul class="space-y-3 text-sm">
                    <li class="flex items-start gap-2">
                        <MapPinIcon icon-class="w-4 h-4 mt-0.5 shrink-0 text-primary-400" />
                        <span>{{ siteConfig.address }}</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <EnvelopeIcon icon-class="w-4 h-4 mt-0.5 shrink-0 text-primary-400" />
                        <a :href="`mailto:${siteConfig.contactEmail}`" class="hover:text-primary-400 transition">{{ siteConfig.contactEmail }}</a>
                    </li>
                    <li class="flex items-start gap-2">
                        <PhoneIcon icon-class="w-4 h-4 mt-0.5 shrink-0 text-primary-400" />
                        <a :href="`tel:${siteConfig.contactPhone}`" class="hover:text-primary-400 transition">{{ siteConfig.contactPhone }}</a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="border-t border-earth-800">
            <div class="max-w-7xl mx-auto px-6 py-5 flex justify-center text-xs text-earth-500">
                <p>{{ $t("components.layouts.AppFooterLayout.copyright", { year: new Date().getFullYear() }) }}</p>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { siteConfig } from "~/src/config/config"

const socialLinks = [
    { label: "YouTube", url: siteConfig.socialLinks.youtube, icon: resolveComponent("YoutubeIcon") },
].filter((l) => l.url)
</script>
