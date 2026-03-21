<template>
    <div class="max-w-3xl mx-auto px-6 py-12">
        <h1 class="text-3xl font-bold text-earth-900 mb-8">{{ t("pages.profile.title") }}</h1>
        <form @submit.prevent="saveProfile" class="bg-white rounded-2xl shadow-lg border border-earth-100 p-8 space-y-6">
            <div>
                <label class="block text-sm font-medium text-earth-600 mb-1">{{ t("pages.profile.email") }}</label>
                <input :value="user?.email" disabled class="w-full rounded-lg border border-earth-200 bg-earth-50 px-4 py-3 text-earth-400" />
            </div>
            <div>
                <label class="block text-sm font-medium text-earth-600 mb-1">{{ t("pages.profile.fullName") }}</label>
                <input
                    v-model="fullName"
                    type="text"
                    class="w-full rounded-lg border border-earth-200 px-4 py-3 transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
            </div>
            <div>
                <label class="block text-sm font-medium text-earth-600 mb-1">{{ t("pages.profile.avatarUrl") }}</label>
                <div v-if="avatarUrl" class="mb-3 flex items-center gap-3">
                    <img :src="avatarUrl" alt="Avatar preview" class="w-16 h-16 rounded-full object-cover ring-2 ring-primary-400" />
                    <span class="text-xs text-earth-400">{{ t("pages.profile.preview") }}</span>
                </div>
                <input
                    v-model="avatarUrl"
                    type="url"
                    class="w-full px-4 py-3 rounded-xl border border-earth-200 outline-none transition focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    placeholder="https://..."
                />
            </div>
            <p v-if="isSaved" class="text-green-600 text-sm">{{ t("pages.profile.saved") }}</p>
            <button type="submit" :disabled="isLoading" class="bg-primary-400 hover:bg-primary-500 text-white px-8 py-3 rounded-full font-bold disabled:opacity-50 transition">
                {{ isLoading ? t("pages.profile.saving") : t("pages.profile.save") }}
            </button>
            <pre>{{ user }}</pre>
        </form>
    </div>

</template>
<script setup lang="ts">
definePageMeta({ middleware: "role-guard", visibilityKey: "visibility.profile.view" })
const user = useSupabaseUser()
const { profiles: profileService } = useServices()
const { t } = useI18n()
const isLoading = ref(false)
const isSaved = ref(false)
const fullName = ref("")
const avatarUrl = ref("")

// fetch perfil y sincronizar form cuando lleguen los datos
const { data: profile } = useLazyAsyncData("profile-page", () => {
    if (!user.value) return Promise.resolve(null)
    return profileService.fetchById(user.value.sub)
}, { watch: [user] })

watch(profile, (p) => {
    if (!p) return
    fullName.value = p.full_name || ""
    avatarUrl.value = p.avatar_url || ""
}, { immediate: true })

async function saveProfile() {
    if (!user.value) return
    isLoading.value = true
    isSaved.value = false

    const { error } = await profileService.update(user.value.sub, {
        full_name: fullName.value,
        avatar_url: avatarUrl.value,
    })

    isLoading.value = false
    if (error) return
    isSaved.value = true
}
</script>
