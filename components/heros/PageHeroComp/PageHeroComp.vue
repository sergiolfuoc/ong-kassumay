<template>
    <section class="relative flex items-center overflow-hidden" :class="heightClass">
        <div
            class="absolute inset-0 bg-cover bg-center"
            :style="{ backgroundImage: `url('${image ?? DEFAULT_IMAGE}')` }"
        />
        <div class="absolute inset-0" :style="{ background: gradientStyle }" />
        <div class="relative max-w-7xl mx-auto px-6 py-20 w-full">
            <div class="max-w-2xl">
                <span
                    v-if="tag"
                    class="inline-flex items-center gap-2 bg-kassumay-500/20 text-kassumay-400 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6 backdrop-blur-sm border border-kassumay-500/20"
                >
                    {{ tag }}
                </span>
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
                    {{ title }}
                </h1>
                <p v-if="subtitle" class="text-warm-200 text-lg md:text-xl mt-6 leading-relaxed max-w-xl">
                    {{ subtitle }}
                </p>
                <slot name="actions" />
            </div>
        </div>
    </section>

</template>
<script setup lang="ts">
type GradientColor = "kassumay" | "earth" | "primary" | "transparent"

const DEFAULT_IMAGE = "/images/heroes/senegal-grupo.jpg"

const props = withDefaults(defineProps<{
    title: string
    subtitle?: string
    tag?: string
    image?: string
    size?: "SM" | "MD" | "LG"
    from?: GradientColor
    to?: GradientColor
}>(), {
    size: "MD",
    from: "earth",
    to: "kassumay",
})

// mapeo a colores "crudos" porque tailwind JIT no me pilla las clases dinamicas
const palette: Record<GradientColor, { strong: string; soft: string }> = {
    kassumay:    { strong: "rgba(107, 94, 26, 0.85)",  soft: "rgba(107, 94, 26, 0.2)"  },
    earth:       { strong: "rgba(26, 35, 50, 0.85)",   soft: "rgba(26, 35, 50, 0.2)"   },
    primary:     { strong: "rgba(10, 79, 43, 0.85)",   soft: "rgba(10, 79, 43, 0.2)"   },
    transparent: { strong: "transparent",              soft: "transparent"             },
}

const gradientStyle = computed(() => {
    const fromColor = palette[props.from].strong
    const toColor = props.to ? palette[props.to].soft : "transparent"
    return `linear-gradient(to right, ${fromColor}, ${toColor})`
})

const heightClass = computed(() => {
    if (props.size === "LG") return "min-h-[90vh]"
    if (props.size === "SM") return "min-h-[40vh]"
    return "min-h-[55vh]"
})
</script>
