<template>
    <details class="group bg-earth-50 rounded-xl border border-earth-200" :open="open">
        <summary class="flex justify-between items-center cursor-pointer px-6 py-5 text-lg font-display font-bold text-earth-900">
            {{ title }}
            <span class="text-earth-400 text-xl group-open:hidden">+</span>
            <span class="text-earth-400 text-xl hidden group-open:inline">&minus;</span>
        </summary>
        <div class="px-6 pb-5 text-earth-600">
            <slot />
        </div>
    </details>
</template>

<script setup lang="ts">
defineProps<{ title: string; open?: boolean }>()
</script>
