<template>
    <div :class="design.wrapper" ref="dropdownRef">
        <button
            :class="[design.toggleButton, dark ? design.toggleDark : design.toggleLight]"
            @click="(isOpen = !isOpen)"
        >
            <GlobeAltIcon class="w-5 h-5" />
            {{ currentLabel }}
        </button>
        <Transition name="fade">
            <ul v-if="isOpen" :class="design.menu">
                <li v-for="loc in locales" :key="loc.code">
                    <button
                        :class="[design.menuItem, loc.code === locale ? design.menuItemActive : design.menuItemIdle]"
                        @click="handleSwitchLocale(loc.code)"
                    >
                        {{ loc.name }}
                    </button>
                </li>
            </ul>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { GlobeAltIcon } from "@heroicons/vue/24/outline"

defineProps<{ dark?: boolean }>()

const { locale, locales, setLocale } = useI18n()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement>()

const currentLabel = computed(() => {
    const found = (locales.value as Array<{ code: string; name: string }>).find((l) => l.code === locale.value)
    return found?.name ?? locale.value.toUpperCase()
})

function handleSwitchLocale(code: "en" | "es" | "cat" | "fr") {
    setLocale(code)
    isOpen.value = false
}

function onClickOutside(e: MouseEvent) {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
        isOpen.value = false
    }
}

onMounted(() => document.addEventListener("click", onClickOutside))
onUnmounted(() => document.removeEventListener("click", onClickOutside))

const design = {
    wrapper: "relative",
    toggleButton: "flex items-center gap-1.5 text-sm font-medium transition",
    toggleDark: "text-earth-300 hover:text-white",
    toggleLight: "text-earth-600 hover:text-earth-900",
    menu: "absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-earth-100 py-1 z-50",
    menuItem: "w-full text-left px-4 py-2 text-sm hover:bg-earth-50 transition",
    menuItemActive: "text-primary-500 font-semibold",
    menuItemIdle: "text-earth-700",
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
