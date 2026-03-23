<template>
    <header :class="design.header">
        <div :class="design.headerContainer">
            <NuxtLink to="/" :class="design.brandLink">
                <img src="/images/logo-kassumay.png" alt="Fundació Kassumay" class="h-10" />
            </NuxtLink>

            <nav :class="design.desktopNav">
                <NuxtLink v-for="headerRoute in headerRoutes" :key="headerRoute.to" :to="headerRoute.to" :class="design.navLink">{{ t(headerRoute.label) }}</NuxtLink>

                <template v-if="user">
                    <NuxtLink v-for="headerAuthRoute in headerAuthRoutes" :key="headerAuthRoute.to"
                        :to="headerAuthRoute.to"
                        class="flex items-center gap-2 text-earth-700 hover:text-primary-500 transition text-sm font-medium">
                        <img :src="profile?.avatar_url || '/images/default-avatar.svg'"
                            alt="" class="w-7 h-7 rounded-full object-cover" />
                        {{ t(headerAuthRoute.label) }}
                    </NuxtLink>
                    <button :class="design.logoutButton" @click="handleLogout">{{ t("composables.useNavigation.signOut") }}</button>
                </template>
                <template v-else>
                    <NuxtLink
                        v-for="headerGuestRoute in headerGuestRoutes"
                        :key="headerGuestRoute.to"
                        :to="headerGuestRoute.to"
                        :class="
                            headerGuestRoute.variant === 'outline'
                                ? design.guestOutlineLink
                                : design.navLink
                        "
                        >{{ t(headerGuestRoute.label) }}</NuxtLink
                    >
                </template>

                <LanguageSwitcherComp />
            </nav>

            <div :class="design.mobileActions">
                <LanguageSwitcherComp />
                <button :class="design.menuToggle" @click="(isMobileMenuOpen = !isMobileMenuOpen)" aria-label="Toggle menu">
                    <XMarkIcon v-if="isMobileMenuOpen" class="w-6 h-6" />
                    <Bars3Icon v-else class="w-6 h-6" />
                </button>
            </div>
        </div>

        <Transition name="slide">
            <nav v-if="isMobileMenuOpen" :class="design.mobileNav">
                <NuxtLink v-for="headerRoute in headerRoutes" :key="headerRoute.to" :to="headerRoute.to" :class="design.mobileNavLink" @click="(isMobileMenuOpen = false)">{{ t(headerRoute.label) }}</NuxtLink>

                <template v-if="user">
                    <NuxtLink v-for="headerAuthRoute in headerAuthRoutes" :key="headerAuthRoute.to"
                        :to="headerAuthRoute.to"
                        class="flex items-center gap-2 text-earth-800 hover:text-primary-500 font-medium"
                        @click="(isMobileMenuOpen = false)">
                        <img :src="profile?.avatar_url || '/images/default-avatar.svg'"
                            alt="" class="w-7 h-7 rounded-full object-cover" />
                        {{ t(headerAuthRoute.label) }}
                    </NuxtLink>
                    <button :class="design.mobileLogoutButton" @click="handleLogout">{{ t("composables.useNavigation.signOut") }}</button>
                </template>
                <template v-else>
                    <NuxtLink
                        v-for="headerGuestRoute in headerGuestRoutes"
                        :key="headerGuestRoute.to"
                        :to="headerGuestRoute.to"
                        :class="design.mobileNavLink"
                        @click="(isMobileMenuOpen = false)"
                        >{{ t(headerGuestRoute.label) }}</NuxtLink
                    >
                </template>
            </nav>
        </Transition>
    </header>

</template>
<script setup lang="ts">
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline"

const { t } = useI18n()
const { user, profile, headerRoutes, headerGuestRoutes, headerAuthRoutes } = useNavigation()
const supabase = useSupabaseClient()
const isMobileMenuOpen = ref(false)

const design = {
    header: "bg-white sticky top-0 z-50 border-b border-earth-100",
    headerContainer: "max-w-7xl mx-auto px-6 py-3 flex justify-between items-center",
    brandLink: "flex items-center gap-2.5",
    brandIconWrap: "w-10 h-10 bg-primary-400 rounded-full flex items-center justify-center",
    brandText: "text-xl font-bold text-earth-900 tracking-tight",
    desktopNav: "hidden lg:flex items-center gap-7",
    navLink: "text-earth-700 hover:text-primary-500 transition text-sm font-medium",
    guestOutlineLink: "border border-primary-400 text-primary-500 hover:bg-primary-50 px-4 py-2 rounded-full text-sm font-semibold transition",
    logoutButton: "text-sm text-earth-400 hover:text-red-500 transition",
    mobileActions: "flex items-center gap-3 lg:hidden",
    menuToggle: "text-earth-700 p-1",
    mobileNav: "lg:hidden bg-white border-t border-earth-100 px-6 py-5 space-y-4",
    mobileNavLink: "block text-earth-800 hover:text-primary-500 font-medium",
    mobileLogoutButton: "text-sm text-earth-400 hover:text-red-500",
}

async function handleLogout() {
    await supabase.auth.signOut()
    isMobileMenuOpen.value = false
    navigateTo("/")
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: all 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>
