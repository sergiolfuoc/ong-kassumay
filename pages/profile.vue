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
                    required
                    minlength="3"
                    class="w-full rounded-lg border border-earth-200 px-4 py-3 transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
            </div>
            <div>
                <label class="block text-sm font-medium text-earth-600 mb-1">{{ t("pages.profile.avatar") }}</label>
                <div class="mb-3 relative w-20">
                    <img :src="previewUrl || avatarUrl || '/images/default-avatar.svg'"
                        alt="Avatar" class="w-20 h-20 rounded-full object-cover ring-2 ring-primary-400" />
                    <button v-if="previewUrl || avatarUrl" type="button" @click="removeAvatar"
                        class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition">
                        &times;
                    </button>
                </div>
                <input
                    ref="fileInput"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    @change="onChangeFileSelected"
                    class="w-full text-sm text-earth-600
                        file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                        file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-600
                        hover:file:bg-primary-100"
                />
            </div>
            <p v-if="formError" class="text-red-500 text-sm">{{ formError }}</p>
            <p v-if="isSaved" class="text-green-600 text-sm">{{ t("pages.profile.saved") }}</p>
            <button type="submit" :disabled="isLoading" class="bg-primary-400 hover:bg-primary-500 text-white px-8 py-3 rounded-full font-bold disabled:opacity-50 transition">
                {{ isLoading ? t("pages.profile.saving") : t("pages.profile.save") }}
            </button>
        </form>
    </div>

</template>
<script setup lang="ts">
import { useToast } from "vue-toastification"

definePageMeta({ middleware: "role-guard", visibilityKey: "visibility.profile.view" })

const user = useSupabaseUser()
const { profiles: profileService } = useServices()
const { t } = useI18n()
const toast = useToast()
const isLoading = ref(false)
const isSaved = ref(false)
const fullName = ref("")
const avatarUrl = ref("")
const selectedFile = ref<File | null>(null)
const previewUrl = ref("")
const fileInput = ref<HTMLInputElement | null>(null)
const formError = ref("")


//#region [ Reactivity ]
// fetch perfil y sincronizar form cuando lleguen los datos
const { data: profile } = useLazyAsyncData("profile-page", () => {
    if (!user.value) return Promise.resolve(null)
    return profileService.fetchById(user.value.sub)
}, { watch: [user] })

function onChangeFileSelected(event: Event) {
    const input = event.target as HTMLInputElement
    selectedFile.value = input.files?.[0] ?? null
    if (selectedFile.value) {
        previewUrl.value = URL.createObjectURL(selectedFile.value)
    } else {
        previewUrl.value = ""
    }
}

watch(profile, (p) => {
    if (!p) return
    fullName.value = p.full_name || ""
    avatarUrl.value = p.avatar_url || ""
}, { immediate: true })
//#endregion

function removeAvatar() {
    selectedFile.value = null
    previewUrl.value = ""
    avatarUrl.value = ""
    if (fileInput.value) fileInput.value.value = ""
}
async function saveProfile() {
    if (!user.value) return
    formError.value = ""
    isSaved.value = false

    if (!fullName.value.trim()) {
        formError.value = t("pages.profile.errors.nameRequired")
        toast.error(formError.value)
        return
    }
    if (selectedFile.value && selectedFile.value.size > 2 * 1024 * 1024) {
        formError.value = t("pages.profile.errors.fileTooLarge")
        toast.error(formError.value)
        return
    }

    isLoading.value = true

    if (selectedFile.value) {
        const { data: newUrl, error: uploadErr } = await profileService.uploadAvatar(
            user.value.sub, selectedFile.value
        )
        if (uploadErr) { isLoading.value = false; formError.value = uploadErr; toast.error(uploadErr); return }
        avatarUrl.value = newUrl!
        selectedFile.value = null
        previewUrl.value = ""
    }

    const { error } = await profileService.update(user.value.sub, {
        full_name: fullName.value,
        avatar_url: avatarUrl.value,
    })

    isLoading.value = false
    if (error) {
        formError.value = error
        toast.error(error)
        return
    }
    isSaved.value = true
    toast.success(t("pages.profile.saved"))
    refreshNuxtData("nav-profile")
}
</script>
