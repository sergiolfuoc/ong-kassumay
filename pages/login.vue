<template>
    <div class="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-primary-50 via-earth-50 to-amber-50">
        <!-- fondo -->
        <div class="pointer-events-none absolute -top-64 -left-64 w-[40rem] h-[40rem] bg-primary-300/25 rounded-full blur-[180px]" />
        <div class="pointer-events-none absolute -bottom-64 -right-64 w-[44rem] h-[44rem] bg-amber-300/25 rounded-full blur-[180px]" />
        <!-- form -->
        <div class="relative w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 p-8">
            <div class="text-center mb-8">
                <NuxtLink to="/" class="inline-block">
                    <img src="/images/logo-kassumay.png" :alt="t('pages.login.brand')" class="h-12 mx-auto" />
                </NuxtLink>
                <h1 class="text-xl font-bold text-earth-900 mt-4">{{ t("pages.login.title") }}</h1>
                <p class="text-earth-400 text-sm mt-1">{{ t("pages.login.subtitle") }}</p>
            </div>
            <form @submit.prevent="handleLogin" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-earth-600 mb-1">{{ t("pages.login.email") }}</label>
                    <input
                        v-model="email"
                        type="email"
                        required
                        class="w-full px-4 py-3 border border-earth-200 rounded-xl outline-none transition focus:ring-2 focus:ring-primary-400"
                        :placeholder="t('pages.login.emailPlaceholder')"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-earth-600 mb-1">{{ t("pages.login.password") }}</label>
                    <input
                        v-model="password"
                        type="password"
                        required
                        minlength="6"
                        class="w-full rounded-xl border border-earth-200 px-4 py-3 transition focus:border-primary-400 focus:ring-2 focus:ring-primary-400/70 focus:outline-none"
                        :placeholder="t('pages.login.passwordPlaceholder')"
                    />
                </div>
                <FormActionsButtonsComp
                    :loading="isLoading"
                    :label="t('pages.login.submit')"
                    :loading-label="t('pages.login.loading')"
                    :error="error"
                    button-class="w-full rounded-xl bg-primary-400 py-3 font-bold text-white transition hover:bg-primary-500 disabled:opacity-50"
                />
            </form>
            <p class="mt-6 text-center text-sm text-earth-400">
                {{ t("pages.login.noAccount") }}
                <NuxtLink to="/register" class="text-primary-500 hover:text-primary-600 font-semibold"> {{ t("composables.useNavigation.signUp") }} </NuxtLink>
            </p>
            <p class="mt-3 text-center text-sm">
                <NuxtLink to="/" class="text-earth-500 hover:text-earth-700">← {{ t("composables.useNavigation.home") }}</NuxtLink>
            </p>
        </div>
    </div>

</template>
<script setup lang="ts">
definePageMeta({ layout: false })
const { t } = useI18n()
const supabase = useSupabaseClient()
const email = ref("")
const password = ref("")
const error = ref("")
const isLoading = ref(false)

async function handleLogin() {
    // reset
    isLoading.value = true
    error.value = ""

    // sign in
    const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    })
    if (authError) {
        error.value = t("pages.login.error")
        isLoading.value = false
        return
    }
    navigateTo("/")
}
</script>
