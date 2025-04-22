<template>
  <div class="editor-wrapper">
    <div class="menu-bar flex gap-2 mb-4 overflow-x-auto whitespace-nowrap" v-if="editor">
      <EditorButton icon="Bold" :active="editor.isActive('bold')" @click="() => toggle('bold')" tooltip="Жирный" />
      <EditorButton icon="Italic" :active="editor.isActive('italic')" @click="() => toggle('italic')" tooltip="Курсив" />
      <EditorButton icon="Underline" :active="editor.isActive('underline')" @click="() => toggle('underline')" tooltip="Подчёркнутый" />
      <EditorButton icon="Strikethrough" :active="editor.isActive('strike')" @click="() => toggle('strike')" tooltip="Зачёркнутый" />

        <div class="relative" ref="colorPickerRef">
          <EditorButton icon="Palette" @click="toggleColor" tooltip="Цвет текста" />
        </div>

        <teleport to="body">
          <Transition name="fade">
            <div
              v-if="toggleColorPicker"
              ref="colorPickerRef"
              class="fixed z-[9999] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg p-3 flex flex-wrap gap-2 w-52"
              :style="{ top: `${colorPickerCoords.top}px`, left: `${colorPickerCoords.left}px` }"
            >
              <!-- Пресеты -->
            <button
              v-for="color in colors"
              :key="color"
              :style="{ backgroundColor: color }"
              class="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
              @click="setColor(color)"
              :title="color"
            />

            <!-- Кастомный цвет -->
            <div class="w-full mt-2">
              <input
                type="color"
                class="w-full h-8 cursor-pointer rounded border border-gray-300 dark:border-gray-600 bg-transparent"
                v-model="customColor"
                @change="setColor(customColor)"
              />
            </div>
          </div>
        </Transition>
      </teleport>

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

    <div class="w-full max-h-[400px] overflow-y-auto border border-gray-300 dark:border-gray-600 rounded p-3 bg-white dark:bg-gray-800 focus:outline-none">
      <EditorContent :editor="editor" />
    </div>

  </div>
  <imageUploadModal
    v-if="showImageModal"
    @close="showImageModal = false"
    @uploaded="handleImageUploaded"
  />
  <linkModal
    v-if="showLinkModal"
    @close="showLinkModal = false"
    @insert="handleLinkInsert"
  />
  <editImageModal
    v-if="showImageEditor"
    :attrs="selectedImageNode?.attrs"
    @close="showImageEditor = false"
    @save="updateImage"
  ></editImageModal>
</template>

<script setup>
import { onBeforeUnmount, watch, ref, computed } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import EditorButton from '~/components/editorButton.vue'
import imageUploadModal from '~/components/modals/imageUploadModal.vue'
import linkModal from '~/components/modals/linkModal.vue'
import { customImage } from '~/components/extensions/customImage'
import editImageModal from '~/components/modals/editImageModal.vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({ content: String })
const emit = defineEmits(['update:content'])
const showImageModal = ref(false)
const showLinkModal = ref(false)
const customColor = ref('#000000')

const editor = new Editor({
  content: props.content || '',
  extensions: [
    StarterKit,
    Underline,
    Link.configure({ openOnClick: false }),
    customImage.configure({
      onClick: (attrs) => {
        selectedImageNode.value = { attrs }
        showImageEditor.value = true
      }
    }),
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

const toggleColorPicker = ref(false)
const colorPickerRef = ref(null)

const colors = [
  // Нейтральные
  '#000000', '#1f2937', '#374151', '#4b5563', '#6b7280', '#d1d5db', '#ffffff',

  // Акцентные
  '#dc2626', '#f97316', '#facc15', '#22c55e', '#0ea5e9', '#3b82f6',
  '#6366f1', '#a855f7', '#ec4899',

  // Дополнительные
  '#14b8a6', '#8b5cf6', '#f43f5e', '#e2e8f0'
]

const setColor = (color) => {
  editor.chain().focus().setColor(color).run()
  toggleColorPicker.value = false
}

onClickOutside(colorPickerRef, () => {
  toggleColorPicker.value = false
})

const colorPickerCoords = ref({ top: 0, left: 0 })

const toggleColor = () => {
  if (!colorPickerRef.value) return
  const rect = colorPickerRef.value.getBoundingClientRect()
  colorPickerCoords.value = {
    top: rect.bottom + window.scrollY + 8,
    left: rect.left + window.scrollX
  }
  toggleColorPicker.value = !toggleColorPicker.value
}

editor.storage.customImageClickHandler = (attrs, getPos) => {
  selectedImageNode.value = { attrs, getPos }
  showImageEditor.value = true
}


const selectedImageNode = ref(null)
const showImageEditor = ref(false)

const currentBlock = computed(() => {
  if (editor.isActive('heading', { level: 1 })) return 'h1'
  if (editor.isActive('heading', { level: 2 })) return 'h2'
  if (editor.isActive('heading', { level: 3 })) return 'h3'
  return 'paragraph'
})

editor.on('selectionUpdate', ({ editor }) => {
  const node = editor.state.selection.node?.type?.name === 'customImage'
    ? editor.state.selection.node
    : null
  selectedImageNode.value = node
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

const updateImage = (attrs) => {
  if (!selectedImageNode.value) return
  const { getPos } = selectedImageNode.value
  if (typeof getPos === 'function') {
    editor
      .chain()
      .focus()
      .command(({ tr }) => {
        const pos = getPos()
        tr.setNodeMarkup(pos, undefined, {
          ...editor.state.doc.nodeAt(pos)?.attrs,
          ...attrs
        })
        return true
      })
      .run()
  }
  showImageEditor.value = false
}

onBeforeUnmount(() => editor.destroy())

const toggle = (mark) => editor.chain().focus()[`toggle${capitalize(mark)}`]().run()
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const toggleHeading = (level) => editor.chain().focus().toggleHeading({ level }).run()
const align = (dir) => editor.chain().focus().setTextAlign(dir).run()

const addLink = () => {
  showLinkModal.value = true
}

const handleLinkInsert = ({ url, text }) => {
  editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  if (text) {
    editor.commands.insertContent(`<a href="${url}">${text}</a>`)
  }
}

const addImage = () => {
  showImageModal.value = true
}

const handleImageUploaded = (url) => {
  editor.chain().focus().setImage({ src: url }).run()
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

.editor-wrapper {
  width: 100%;
  max-width: 100%;
}

.ProseMirror {
  min-height: 300px;
  width: 100%;
}

.ProseMirror img {
  display: block;
  max-width: 100%;
  height: auto;
}

.ProseMirror img[style*="width"] {
  max-width: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
