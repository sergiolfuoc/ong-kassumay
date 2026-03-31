<template>
    <ClientOnly>
        <div
            class="tiptap-wrapper border border-earth-200 rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary-400 focus-within:border-primary-400 transition">
            <TipTapToolbar :editor="editor ?? undefined" />

            <div @click="editor?.chain().focus().run()">
                <EditorContent :editor="editor" class="tiptap-content" />
            </div>

            <div v-if="editor"
                class="flex items-center justify-end gap-3 px-3 py-1 border-t border-earth-100 bg-earth-50/40 text-xs text-earth-400">
                <span>{{ count }} {{ t("components.editor.TipTapEditorComp.characters") }}</span>
            </div>
        </div>

        <template #fallback>
            <div class="w-full border border-earth-200 rounded-xl bg-earth-50 min-h-[280px] animate-pulse" />
        </template>
    </ClientOnly>

</template>
<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3"
// StarterKit ya trae heading, bold, italic, listas y blockquote
// No meter el Heading con el StarterKit (duplica el schema y tira un warning silencioso en consola)
import StarterKit from "@tiptap/starter-kit"
import TiptapImage from "@tiptap/extension-image"
import TiptapLink from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"

const props = defineProps<{
    modelValue: string
    placeholder?: string
}>()
const emit = defineEmits<{ "update:modelValue": [value: string] }>()

const { t } = useI18n()

// Debounce manual: No meto lodash para una unica funcionalidad en un unico componente
let emitTimer: ReturnType<typeof setTimeout> | null = null
function emitDebounced(html: string) {
    if (emitTimer) clearTimeout(emitTimer)
    emitTimer = setTimeout(() => {
        emit("update:modelValue", html)
        emitTimer = null
    }, 250)
}

const editor = useEditor({
    content: props.modelValue,
    extensions: [
        StarterKit,
        TiptapImage,
        // openOnClick: false!!!! si no, en el form admin al clicar un link
        // te saca de la pagina en vez de seleccionarlo para editarlo
        TiptapLink.configure({ openOnClick: false }),
        Placeholder.configure({ placeholder: props.placeholder || t("components.editor.TipTapEditorComp.placeholder") }),
    ],
    // Añado debounce para evitar que emita un update por cada caracter
    onUpdate({ editor: e }) {
        emitDebounced(e.getHTML())
    },
})

// Como @tiptap/extension-character-count no esta instalada pongo contador manual, pero primera opcion el oficial por si se instala en el futuro
const count = computed(() => editor.value?.storage.characterCount?.characters?.() ?? editor.value?.getText().length ?? 0)

// emitUpdate:false evita el loop v-model -> editor.onUpdate -> v-model -> setContent...
watch(() => props.modelValue, (val) => {
    if (editor.value && editor.value.getHTML() !== val) {
        editor.value.commands.setContent(val, { emitUpdate: false })
    }
})
onBeforeUnmount(() => {
    // si el usuario cierra el form sin esperar al debounce, forzamos el ultimo emit
    // para no perder cambios. si no, al cerrar y reabrir el form salia desactualizado
    if (emitTimer) {
        clearTimeout(emitTimer)
        if (editor.value) emit("update:modelValue", editor.value.getHTML())
    }
    editor.value?.destroy()
})

// PENDIENTE:
// - sanitizar el HTML antes del emit. Ahora lo hace el form con dompurify pero deberia estar aqui
// - characterCount no funciona del todo, falta instalar @tiptap/extension-character-count
</script>
<style>
/* Placeholder: lo saco del flujo con position absolute para que no afecte
   a la altura del parrafo vacio (si no, el editor "salta" al escribir la primera letra). */
.tiptap p.is-editor-empty:first-child {
    position: relative;
}
.tiptap p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    position: absolute;
    top: 0;
    left: 0;
    color: #9ca3af;
    pointer-events: none;
}

.tiptap-content .tiptap {
    padding: 16px 20px;
    min-height: 280px;
    outline: none;
    font-size: 0.95rem;
    line-height: 1.7;
    color: #292524;
}

.tiptap-content .tiptap>*:first-child {
    margin-top: 0;
}

.tiptap-content .tiptap>*:last-child {
    margin-bottom: 0;
}

.tiptap-content .tiptap h1 {
    font-size: 1.6rem;
    font-weight: 700;
    margin: 1.5rem 0 0.5rem;
    line-height: 1.2;
}

.tiptap-content .tiptap h2 {
    font-size: 1.3rem;
    font-weight: 700;
    margin: 1.3rem 0 0.4rem;
    line-height: 1.25;
}

.tiptap-content .tiptap h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 1.1rem 0 0.3rem;
    line-height: 1.3;
}

.tiptap-content .tiptap p {
    margin: 0.6rem 0;
}

.tiptap-content .tiptap ul {
    list-style: disc;
    padding-left: 1.5rem;
    margin: 0.5rem 0;
}

.tiptap-content .tiptap ol {
    list-style: decimal;
    padding-left: 1.5rem;
    margin: 0.5rem 0;
}

.tiptap-content .tiptap li {
    margin: 0.2rem 0;
}

.tiptap-content .tiptap li p {
    margin: 0.1rem 0;
}

.tiptap-content .tiptap blockquote {
    border-left: 3px solid #d6d3d1;
    padding-left: 1rem;
    margin: 0.8rem 0;
    color: #57534e;
    font-style: italic;
}

.tiptap-content .tiptap code {
    background: #f5f5f4;
    border-radius: 0.3rem;
    padding: 0.15em 0.35em;
    font-size: 0.85rem;
    font-family: ui-monospace, monospace;
    color: #c2410c;
}

.tiptap-content .tiptap pre {
    background: #1c1917;
    border-radius: 8px;
    padding: 14px 16px;
    margin: 0.8rem 0;
    overflow-x: auto;
}

.tiptap-content .tiptap pre code {
    background: none;
    color: #e7e5e4;
    padding: 0;
    font-size: 0.82rem;
}

.tiptap-content .tiptap hr {
    border: none;
    border-top: 2px solid #e7e5e4;
    margin: 1.2rem 0;
}

.tiptap-content .tiptap img {
    max-width: 100%;
    border-radius: 0.5rem;
    margin: 0.8rem 0;
}

/* el !important lo necesitaba porque prose-mirror inyecta inline styles
   en algunas builds y se comen el color del link. probado sin el y se ve negro. */
.tiptap-content .tiptap a {
    color: #0e7490 !important;
    text-decoration: underline;
    cursor: pointer;
}

.tiptap-content .tiptap a:hover {
    color: #155e75;
}
</style>
