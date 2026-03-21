<template>
    <div class="min-h-screen flex items-center justify-center bg-earth-50 px-4">
        <div class="w-full max-w-md bg-white rounded-2xl shadow-lg border border-earth-100 p-8">
            <div class="text-center mb-8">
                <NuxtLink to="/" class="text-2xl font-bold text-earth-900">{{ t("pages.register.brand") }}</NuxtLink>
                <h1 class="text-xl font-bold text-earth-900 mt-4">{{ t("pages.register.title") }}</h1>
                <p class="text-earth-400 text-sm mt-1">{{ t("pages.register.subtitle") }}</p>
            </div>
            <form @submit.prevent="registerUser" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ t("pages.register.fullName") }}</label>
                    <input
                        v-model="fullName"
                        type="text"
                        required
                        class="w-full px-4 py-2.5 border border-earth-300 rounded-xl focus:ring-2 focus:ring-primary-400 focus:outline-none transition"
                        :placeholder="t('pages.register.fullNamePlaceholder')"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-earth-600 mb-1">{{ t("pages.register.email") }}</label>
                    <input
                        v-model="email"
                        type="email"
                        required
                        class="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 focus:outline-none transition"
                        :placeholder="t('pages.register.emailPlaceholder')"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-earth-600 mb-1">{{ t("pages.register.password") }}</label>
                    <input
                        v-model="password"
                        type="password"
                        required
                        minlength="6"
                        class="w-full rounded-xl border border-earth-200 px-4 py-3 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-400"
                        :placeholder="t('pages.register.passwordPlaceholder')"
                    />
                </div>
                <FormActionsButtonsComp
                    :loading="isLoading"
                    :label="t('pages.register.submit')"
                    :loading-label="t('pages.register.loading')"
                    :error="error"
                    :success="isSuccess ? t('pages.register.success') : ''"
                    button-class="w-full bg-primary-400 hover:bg-primary-500 text-white py-3 rounded-xl font-bold disabled:opacity-50 transition"
                />
            </form>

            <p class="mt-6 text-center text-sm text-earth-400">
                {{ t("pages.register.hasAccount") }}
                <NuxtLink to="/login" class="text-primary-500 hover:text-primary-600 font-semibold"> {{ t("composables.useNavigation.signIn") }} </NuxtLink>
            </p>
        </div>
    </div>

</template>
<script setup lang="ts">
definePageMeta({ layout: false })
const { t } = useI18n()
const supabase = useSupabaseClient()
const fullName = ref("")
const email = ref("")
const password = ref("")
const isLoading = ref(false)
const error = ref("")
const isSuccess = ref(false)

async function registerUser() {
    isLoading.value = true
    error.value = ""

    const { error: authError } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
            data: { full_name: fullName.value },
        },
    })

    if (authError) {
        error.value = authError.message
        isLoading.value = false
        return
    }

    isSuccess.value = true
    isLoading.value = false
}
</script>
