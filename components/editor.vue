<template>
  <div class="editor-wrapper">
    <div class="menu-bar flex gap-2 mb-4 overflow-x-auto whitespace-nowrap" v-if="editor">
      <EditorButton icon="Bold" :active="editor.isActive('bold')" @click="() => toggle('bold')" tooltip="Жирный" />
      <EditorButton icon="Italic" :active="editor.isActive('italic')" @click="() => toggle('italic')" tooltip="Курсив" />
      <EditorButton icon="Underline" :active="editor.isActive('underline')" @click="() => toggle('underline')" tooltip="Подчёркнутый" />
      <EditorButton icon="Strikethrough" :active="editor.isActive('strike')" @click="() => toggle('strike')" tooltip="Зачёркнутый" />

      <select
        class="border text-sm px-2 py-1 rounded bg-white dark:bg-gray-800 dark:text-white"
        v-if="editor"
        :value="currentBlock"
        @change="changeBlock($event.target.value)"
      >
        <option value="paragraph" selected>Абзац</option>
        <option value="h1">Заголовок H1</option>
        <option value="h2">Заголовок H2</option>
        <option value="h3">Заголовок H3</option>
      </select>

      <EditorButton icon="List" @click="() => editor.chain().focus().toggleBulletList().run()" tooltip="Маркированный список" />
      <EditorButton icon="ListOrdered" @click="() => editor.chain().focus().toggleOrderedList().run()" tooltip="Нумерованный список" />
      <EditorButton icon="Quote" @click="() => editor.chain().focus().toggleBlockquote().run()" tooltip="Цитата" />
      <EditorButton icon="Code" @click="() => editor.chain().focus().toggleCodeBlock().run()" tooltip="Блок кода" />

      <EditorButton icon="AlignLeft" :active="editor.isActive({ textAlign: 'left' })" @click="() => align('left')" tooltip="Выровнять влево" />
      <EditorButton icon="AlignCenter" :active="editor.isActive({ textAlign: 'center' })" @click="() => align('center')" tooltip="По центру" />
      <EditorButton icon="AlignRight" :active="editor.isActive({ textAlign: 'right' })" @click="() => align('right')" tooltip="Вправо" />

      <EditorButton icon="Link" @click="addLink" tooltip="Вставить ссылку" />
      <EditorButton icon="Image" @click="addImage" tooltip="Вставить изображение" />
    </div>

    <EditorContent
      :editor="editor"
      class="w-full max-h-[400px] overflow-y-auto border border-gray-300 dark:border-gray-600 rounded p-3 bg-white dark:bg-gray-800 focus:outline-none"
    />
  </div>
</template>

<script setup>
import { onBeforeUnmount, watch } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { computed } from 'vue'
import EditorButton from '~/components/editorButton.vue'

const props = defineProps({ content: String })
const emit = defineEmits(['update:content'])

const editor = new Editor({
  content: props.content || '',
  extensions: [
    StarterKit,
    Underline,
    Link.configure({ openOnClick: false }),
    Image,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      defaultAlignment: 'left'
    }),
    TextStyle,
    Color,
    Highlight,
  ],
  editorProps: {
    handlePaste(view, event) {
      const text = event.clipboardData?.getData('text/plain')
      if (text) {
        event.preventDefault()
        view.dispatch(
          view.state.tr.insertText(text, view.state.selection.from, view.state.selection.to)
        )
        return true
      }
      return false
    },
    attributes: {
      class: 'ProseMirror focus:outline-none prose dark:prose-invert max-w-none'
    }
  },
  onUpdate: ({ editor }) => {
    emit('update:content', editor.getHTML())
  },
})

const currentBlock = computed(() => {
  if (editor.isActive('heading', { level: 1 })) return 'h1'
  if (editor.isActive('heading', { level: 2 })) return 'h2'
  if (editor.isActive('heading', { level: 3 })) return 'h3'
  return 'paragraph'
})

const changeBlock = (value) => {
  editor.chain().focus()

  if (value === 'paragraph') {
    editor.chain().setParagraph().run()
  } else {
    const level = parseInt(value.replace('h', ''))
    editor.chain().toggleHeading({ level }).run()
  }
}

watch(() => props.content, (newContent) => {
  if (editor && newContent !== editor.getHTML()) {
    editor.commands.setContent(newContent)
  }
})

onBeforeUnmount(() => editor.destroy())

const toggle = (mark) => editor.chain().focus()[`toggle${capitalize(mark)}`]().run()
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const toggleHeading = (level) => editor.chain().focus().toggleHeading({ level }).run()
const align = (dir) => editor.chain().focus().setTextAlign(dir).run()

const addLink = () => {
  const url = window.prompt('Введите URL')
  if (url) {
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }
}
const addImage = () => {
  const url = window.prompt('URL изображения')
  if (url) {
    editor.chain().focus().setImage({ src: url }).run()
  }
}
</script>

<style scoped>
.editor-scroll-container {
  height: 100%;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: white;
  padding: 0.75rem;
}

.dark .editor-scroll-container {
  background-color: #1f2937;
  border-color: #4b5563;
}

.editor-content {
  outline: none;
  white-space: pre-wrap;
  min-height: 100%;
}

/* доп. стили для визуальной поддержки, если prose не работает */
.ProseMirror a {
  color: #3b82f6;
  text-decoration: underline;
}

.ProseMirror h1 {
  font-size: 2rem;
  font-weight: bold;
  margin: 1rem 0 0.5rem;
}

.ProseMirror h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 1rem 0 0.5rem;
}

.ProseMirror h3 {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 1rem 0 0.5rem;
}

.ProseMirror blockquote {
  border-left: 4px solid #d1d5db; /* gray-300 */
  padding-left: 1rem;
  color: #6b7280; /* gray-500 */
  font-style: italic;
  margin: 1rem 0;
}

.dark .ProseMirror blockquote {
  border-left-color: #4b5563; /* gray-600 */
  color: #9ca3af; /* gray-400 */
}

.ProseMirror ul {
  list-style-type: disc;
  margin-left: 1.5rem;
  padding-left: 0.5rem;
  margin-bottom: 1rem;
}

.ProseMirror ol {
  list-style-type: decimal;
  margin-left: 1.5rem;
  padding-left: 0.5rem;
  margin-bottom: 1rem;
}

.ProseMirror li {
  margin-bottom: 0.25rem;
}

.ProseMirror pre {
  background-color: #f3f4f6; /* gray-100 */
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.dark .ProseMirror pre {
  background-color: #1f2937; /* gray-800 */
}

.ProseMirror code {
  background-color: #f3f4f6;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.875rem;
}

.dark .ProseMirror code {
  background-color: #374151; /* gray-700 */
  color: #facc15; /* yellow-400 */
}
</style>
