export default defineNuxtConfig({
    devtools: { enabled: true },
    components: [{ path: "~/components", pathPrefix: false }],
    modules: [
        "@nuxtjs/tailwindcss",
        "@nuxtjs/i18n",
    ],
    i18n: {
        locales: [
            { code: "en", name: "English", file: "en.json" },
            { code: "es", name: "Español", file: "es.json" },
            { code: "cat", name: "Català", file: "cat.json" },
            { code: "fr", name: "Français", file: "fr.json" },
        ],
        defaultLocale: "en",
        strategy: "no_prefix",
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: "i18n_locale",
            fallbackLocale: "en",
        },
    },
    app: {
        head: {
            title: "ONG Platform",
            meta: [
                { charset: "utf-8" },
                { name: "viewport", content: "width=device-width, initial-scale=1" },
                { name: "description", content: "NGO Web Platform - News and Crowdfunding" },
            ],
            link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
        },
    },
    compatibilityDate: "2025-01-01",
})
