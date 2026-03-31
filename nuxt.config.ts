export default defineNuxtConfig({
    devtools: { enabled: true },
    components: [{ path: "~/components", pathPrefix: false }],
    modules: [
        "@nuxtjs/tailwindcss",
        "@nuxtjs/i18n",
        "@nuxtjs/supabase",
    ],
    supabase: {
        redirect: false,
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_KEY,
        types: "~/src/types/db/database",
    },
    i18n: {
        locales: [
            { code: "en", name: "English", file: "en.json" },
            { code: "es", name: "Español", file: "es.json" },
            { code: "cat", name: "Català", file: "cat.json" },
            { code: "fr", name: "Français", file: "fr.json" },
        ],
        defaultLocale: "en",
        strategy: "no_prefix",
        vueI18n: "./i18n.config.ts",
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: "i18n_locale",
            fallbackLocale: "en",
        },
    },
    app: {
        head: {
            title: "Fundació Kassumay",
            meta: [
                { charset: "utf-8" },
                { name: "viewport", content: "width=device-width, initial-scale=1" },
                { name: "description", content: "NGO Web Platform - News and Crowdfunding" },
            ],
            link: [
                { rel: "icon", type: "image/png", href: "/images/africafavicontransp.png" },
                { rel: "preconnect", href: "https://api.fontshare.com" },
                { rel: "stylesheet", href: "https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" },
            ],
        },
    },
    compatibilityDate: "2025-01-01",
    vite: {
        optimizeDeps: {
            include: ["@heroicons/vue/24/outline", "vue-toastification"],
        },
    },
})
