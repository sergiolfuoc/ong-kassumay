<template>
    <header :class="design.header">
        <div :class="design.headerContainer">
            <NuxtLink to="/" :class="design.brandLink">
                <div :class="design.brandIconWrap">
                    <BrandHeartIcon :size="20" class="text-white" />
                </div>
                <span :class="design.brandText">ONG Senegal</span>
            </NuxtLink>

            <nav :class="design.desktopNav">
                <NuxtLink v-for="r in headerRoutes" :key="r.to" :to="r.to" :class="design.navLink">{{ $t(r.label) }}</NuxtLink>

                <template v-if="user">
                    <button :class="design.logoutButton" @click="handleLogout">{{ $t("composables.useNavigation.signOut") }}</button>
                </template>
                <template v-else>
                    <NuxtLink
                        v-for="r in headerGuestRoutes"
                        :key="r.to"
                        :to="r.to"
                        :class="
                            r.variant === 'outline'
                                ? design.guestOutlineLink
                                : design.navLink
                        "
                        >{{ $t(r.label) }}</NuxtLink
                    >
                </template>

                <LanguageSwitcherComp />
            </nav>

            <div :class="design.mobileActions">
                <LanguageSwitcherComp />
                <button :class="design.menuToggle" @click="(isMobileMenuOpen = !isMobileMenuOpen)" aria-label="Toggle menu">
                    <CloseIcon v-if="isMobileMenuOpen" />
                    <MenuIcon v-else />
                </button>
            </div>
        </div>

        <Transition name="slide">
            <nav v-if="isMobileMenuOpen" :class="design.mobileNav">
                <NuxtLink v-for="r in headerRoutes" :key="r.to" :to="r.to" :class="design.mobileNavLink" @click="(isMobileMenuOpen = false)">{{
                    $t(r.label)
                }}</NuxtLink>

                <template v-if="user">
                    <button :class="design.mobileLogoutButton" @click="handleLogout">{{ $t("composables.useNavigation.signOut") }}</button>
                </template>
                <template v-else>
                    <NuxtLink
                        v-for="r in headerGuestRoutes"
                        :key="r.to"
                        :to="r.to"
                        :class="design.mobileNavLink"
                        @click="(isMobileMenuOpen = false)"
                        >{{ $t(r.label) }}</NuxtLink
                    >
                </template>
            </nav>
        </Transition>
    </header>
</template>

<script setup lang="ts">
const { user, headerRoutes, headerGuestRoutes } = useNavigation()
const supabase = useSupabaseClient()
const isMobileMenuOpen = ref(false)

const design = {
    header: "bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-earth-100",
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
