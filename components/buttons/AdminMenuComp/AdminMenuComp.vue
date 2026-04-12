<template>
    <!-- Desktop: dropdown -->
    <div v-if="variant === 'desktop'" ref="dropdownRef" :class="design.wrapper">
        <button :class="design.toggle" @click="(isOpen = !isOpen)">
            {{ t("composables.useNavigation.admin") }}
            <ChevronDownIcon class="w-4 h-4 transition" :class="isOpen ? 'rotate-180' : ''" />
        </button>
        <Transition name="fade">
            <ul v-if="isOpen" :class="design.menu">
                <li v-for="route in routes" :key="route.to">
                    <NuxtLink :to="route.to" :class="design.menuItem" @click="(isOpen = false)">
                        {{ t(route.label) }}
                    </NuxtLink>
                </li>
            </ul>
        </Transition>
    </div>

    <!-- Mobile: inline collapsible group -->
    <div v-else>
        <button :class="design.mobileToggle" @click="(isOpen = !isOpen)">
            <span>{{ t("composables.useNavigation.admin") }}</span>
            <ChevronDownIcon class="w-4 h-4 transition" :class="isOpen ? 'rotate-180' : ''" />
        </button>
        <div v-if="isOpen" class="pl-4 mt-2 space-y-2">
            <NuxtLink
                v-for="route in routes"
                :key="route.to"
                :to="route.to"
                :class="design.mobileItem"
                @click="onMobileNavigate"
            >
                {{ t(route.label) }}
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from "@heroicons/vue/24/outline"
import type { INavigationRoute } from "~/src/navigation"

const { t } = useI18n()

const props = defineProps<{
    routes: INavigationRoute[]
    variant?: "desktop" | "mobile"
}>()
const emit = defineEmits<{ (e: "navigate"): void }>()

const variant = computed(() => props.variant ?? "desktop")
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement>()

function onMobileNavigate() {
    isOpen.value = false
    emit("navigate")
}

function onClickOutside(e: MouseEvent) {
    if (variant.value !== "desktop") return
    if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
        isOpen.value = false
    }
}

onMounted(() => document.addEventListener("click", onClickOutside))
onUnmounted(() => document.removeEventListener("click", onClickOutside))

const design = {
    wrapper: "relative",
    toggle: "flex items-center gap-1 text-earth-700 hover:text-primary-500 transition text-sm font-medium",
    menu: "absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-earth-100 py-1 z-50",
    menuItem: "block px-4 py-2 text-sm text-earth-700 hover:bg-earth-50 hover:text-primary-600 transition",
    mobileToggle: "flex items-center justify-between w-full text-earth-800 hover:text-primary-500 font-medium",
    mobileItem: "block text-earth-700 hover:text-primary-500 text-sm",
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
