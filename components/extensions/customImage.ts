import { mergeAttributes } from '@tiptap/core'
import Image from '@tiptap/extension-image'

export const customImage = Image.extend({
  name: 'customImage',

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: {
        default: null,
        parseHTML: el => el.getAttribute('width'),
        renderHTML: attrs => attrs.width ? { width: attrs.width } : {}
      },
      float: {
        default: null,
        parseHTML: el => el.style.float || null,
        renderHTML: attrs =>
          attrs.float ? { style: `float: ${attrs.float}; margin: 0 1rem 1rem 1rem;` } : {}
      }
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ({ editor, node, getPos }) => {
      const dom = document.createElement('img')
      dom.src = node.attrs.src
      if (node.attrs.alt) dom.alt = node.attrs.alt
      if (node.attrs.title) dom.title = node.attrs.title
      if (node.attrs.width) dom.width = node.attrs.width
      if (node.attrs.float) dom.style.float = node.attrs.float
      dom.style.cursor = 'pointer'

      dom.addEventListener('click', event => {
        event.preventDefault()
        editor.commands.command(({ tr, dispatch }) => {
          editor.storage.customImageClickHandler?.(node.attrs, getPos)
          return true
        })
      })

      return { dom }
    }
  },

  addStorage() {
    return {
      customImageClickHandler: null
    }
  }
})
