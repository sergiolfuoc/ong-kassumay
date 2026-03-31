<template>
    <div class="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-earth-100 bg-earth-50/60">
        <!-- undo/redo arriba a la izquierda. Sino nadie los ve facilmente -->
        <TipTapToolbarBtn :icon="ArrowUturnLeftIcon" :disabled="!tt?.can().chain().focus().undo().run()" :title="t('components.editor.TipTapEditorComp.undo')" @click="tt?.chain().focus().undo().run()" />
        <TipTapToolbarBtn :icon="ArrowUturnRightIcon" :disabled="!tt?.can().chain().focus().redo().run()" :title="t('components.editor.TipTapEditorComp.redo')" @click="tt?.chain().focus().redo().run()" />

        <div class="w-px h-5 bg-earth-200 mx-1" />

        <!-- heroicons no tiene bold/italic, uso letras -->
        <TipTapToolbarBtn label="B" :active="tt?.isActive('bold')" :disabled="!tt?.can().chain().focus().toggleBold().run()" :title="t('components.editor.TipTapEditorComp.bold')" @click="tt?.chain().focus().toggleBold().run()" />
        <TipTapToolbarBtn label="I" :active="tt?.isActive('italic')" :disabled="!tt?.can().chain().focus().toggleItalic().run()" :title="t('components.editor.TipTapEditorComp.italic')" @click="tt?.chain().focus().toggleItalic().run()" />

        <div class="w-px h-5 bg-earth-200 mx-1" />

        <!-- solo H1 y H2. H3 lo quite porque en mobile rompia el layout del detalle de news -->
        <TipTapToolbarBtn label="H1" :active="tt?.isActive('heading', { level: 1 })" :title="`${t('components.editor.TipTapEditorComp.heading')} 1`" @click="tt?.chain().focus().toggleHeading({ level: 1 }).run()" />
        <TipTapToolbarBtn label="H2" :active="tt?.isActive('heading', { level: 2 })" :title="`${t('components.editor.TipTapEditorComp.heading')} 2`" @click="tt?.chain().focus().toggleHeading({ level: 2 }).run()" />

        <div class="w-px h-5 bg-earth-200 mx-1" />

        <TipTapToolbarBtn :icon="ListBulletIcon" :active="tt?.isActive('bulletList')" :title="t('components.editor.TipTapEditorComp.bulletList')" @click="tt?.chain().focus().toggleBulletList().run()" />
        <!-- <TipTapToolbarBtn :icon="CodeBracketIcon" ... /> quitado porque daba error sin lowlight instalado -->
        <TipTapToolbarBtn :icon="LinkIcon" :active="tt?.isActive('link')" :title="t('components.editor.TipTapEditorComp.insertLink')" @click="insertLink" />
        <TipTapToolbarBtn :icon="PhotoIcon" :title="t('components.editor.TipTapEditorComp.insertImage')" @click="insertImage" />
    </div>

</template>
<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3"
import {
    ListBulletIcon,
    LinkIcon,
    PhotoIcon,
    ArrowUturnLeftIcon,
    ArrowUturnRightIcon,
} from "@heroicons/vue/24/outline"

const props = defineProps<{
    editor: Editor | undefined
}>()

const { t } = useI18n()

// alias corto, lo uso muchas veces en el template y editor.value... cansa
const tt = computed(() => props.editor)

// TODO: validar que sea https, ahora acepta cualquier cosa (incluso javascript:)
function insertLink() {
    if (!props.editor) return
    if (props.editor.isActive("link")) {
        props.editor.chain().focus().unsetLink().run()
        return
    }
    const url = window.prompt(t("components.editor.TipTapEditorComp.promptUrl"))
    if (url) props.editor.chain().focus().setLink({ href: url }).run()
}

function insertImage() {
    const url = window.prompt(t("components.editor.TipTapEditorComp.promptImageUrl"))
    if (url) props.editor?.chain().focus().setImage({ src: url }).run()
}
</script>
