<template>
    <header :class="design.header">
        <div :class="design.headerContainer">
            <NuxtLink to="/" :class="design.brandLink">
                <img src="/images/logo-kassumay.png" alt="Fundació Kassumay" class="h-9" />
            </NuxtLink>

            <nav :class="design.desktopNav">
                <NuxtLink v-for="headerRoute in headerRoutes" :key="headerRoute.to" :to="headerRoute.to" :class="design.navLink">{{ t(headerRoute.label) }}</NuxtLink>
            </nav>

            <div :class="design.desktopRight">
                <div :class="design.pill">
                    <LanguageSwitcherComp />

                    <template v-if="user">
                        <span :class="design.pillDivider" />
                        <div class="relative" ref="profileMenuRef">
                            <button
                                type="button"
                                :class="design.pillProfile"
                                aria-haspopup="menu"
                                :aria-expanded="isProfileMenuOpen"
                                @click="isProfileMenuOpen = !isProfileMenuOpen"
                            >
                                <img :src="profile?.avatar_url || '/images/default-avatar.svg'"
                                    alt="" class="w-7 h-7 rounded-full object-cover" />
                                <ChevronDownIcon
                                    class="w-4 h-4 text-earth-500 transition-transform duration-200"
                                    :class="{ 'rotate-180': isProfileMenuOpen }"
                                />
                            </button>

                            <Transition name="slide">
                                <div v-if="isProfileMenuOpen" :class="design.profileMenu" role="menu">
                                    <NuxtLink
                                        v-for="headerAuthRoute in headerAuthRoutes"
                                        :key="headerAuthRoute.to"
                                        :to="headerAuthRoute.to"
                                        :class="design.profileMenuItem"
                                        role="menuitem"
                                        @click="isProfileMenuOpen = false"
                                    >
                                        {{ t(headerAuthRoute.label) }}
                                    </NuxtLink>
                                    <button
                                        type="button"
                                        :class="design.profileMenuLogout"
                                        role="menuitem"
                                        @click="handleLogout"
                                    >
                                        {{ t("composables.useNavigation.signOut") }}
                                    </button>
                                </div>
                            </Transition>
                        </div>
                    </template>
                    <template v-else>
                        <span :class="design.pillDivider" />
                        <NuxtLink
                            v-for="headerGuestRoute in headerGuestRoutes"
                            :key="headerGuestRoute.to"
                            :to="headerGuestRoute.to"
                            :class="
                                headerGuestRoute.variant === 'outline'
                                    ? design.pillCta
                                    : design.pillLink
                            "
                            >{{ t(headerGuestRoute.label) }}</NuxtLink
                        >
                    </template>
                </div>
                <AdminMenuComp
                    v-if="user && adminPanelRoutes.length"
                    :routes="adminPanelRoutes"
                    variant="desktop"
                />
            </div>

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
                    <AdminMenuComp
                        v-if="adminPanelRoutes.length"
                        :routes="adminPanelRoutes"
                        variant="mobile"
                        @navigate="(isMobileMenuOpen = false)"
                    />
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
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/vue/24/outline"

const { user, profile, headerRoutes, headerGuestRoutes, headerAuthRoutes, adminPanelRoutes } = useNavigation()
const { t } = useI18n()
const supabase = useSupabaseClient()
const isMobileMenuOpen = ref(false)
const isProfileMenuOpen = ref(false)
const profileMenuRef = ref<HTMLElement | null>(null)

function onDocumentClick(event: MouseEvent) {
    if (!isProfileMenuOpen.value) return
    if (profileMenuRef.value && !profileMenuRef.value.contains(event.target as Node)) {
        isProfileMenuOpen.value = false
    }
}

onMounted(() => document.addEventListener("click", onDocumentClick))
onBeforeUnmount(() => document.removeEventListener("click", onDocumentClick))

const design = {
    header: "bg-white sticky top-0 z-50 border-b border-earth-100",
    headerContainer: "max-w-7xl mx-auto px-6 py-3 flex items-center gap-8",
    brandLink: "flex items-center gap-2.5 shrink-0",
    desktopNav: "hidden lg:flex items-center gap-7",
    navLink: "text-earth-700 hover:text-primary-500 transition text-sm font-medium",
    desktopRight: "hidden lg:flex items-center gap-3 shrink-0 ml-auto",
    pill: "flex items-center gap-2 bg-earth-50 rounded-full pl-2 pr-1 py-1 border border-earth-100",
    pillDivider: "w-px h-5 bg-earth-200",
    pillLink: "text-earth-700 hover:text-primary-500 transition text-sm font-medium px-3 py-1",
    pillCta: "bg-primary-500 text-white hover:bg-primary-600 px-4 py-1.5 rounded-full text-sm font-semibold transition",
    pillProfile: "flex items-center gap-2 text-earth-700 hover:text-primary-500 transition text-sm font-medium p-0.5 rounded-full",
    pillLogout: "text-sm text-earth-400 hover:text-red-500 transition px-3 py-1",
    profileMenu: "absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-earth-100 py-2 z-50",
    profileMenuItem: "block px-4 py-2 text-sm text-earth-700 hover:bg-earth-50 hover:text-primary-500 transition",
    profileMenuLogout: "block w-full text-left px-4 py-2 text-sm text-earth-500 hover:bg-earth-50 hover:text-red-500 transition border-t border-earth-100 mt-1 pt-2",
    mobileActions: "flex items-center gap-3 lg:hidden ml-auto",
    menuToggle: "text-earth-700 p-1",
    mobileNav: "lg:hidden bg-white border-t border-earth-100 px-6 py-5 space-y-4",
    mobileNavLink: "block text-earth-800 hover:text-primary-500 font-medium",
    mobileLogoutButton: "text-sm text-earth-400 hover:text-red-500",
}

async function handleLogout() {
    await supabase.auth.signOut()
    isMobileMenuOpen.value = false
    isProfileMenuOpen.value = false
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
