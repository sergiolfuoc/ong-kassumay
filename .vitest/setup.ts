/**
 * Provide Vue auto-imports that Nuxt normally provides at build time.
 * This file is loaded as setup for vitest so all composables using
 * `ref`, `computed`, `watch`, `unref`, etc. work outside Nuxt.
 */
import { ref, computed, watch, unref, reactive, toRef, toRefs, watchEffect, nextTick } from "vue";

// Assign to globalThis so that Nuxt auto-imported usages work
Object.assign(globalThis, {
    ref,
    computed,
    watch,
    unref,
    reactive,
    toRef,
    toRefs,
    watchEffect,
    nextTick,
});
