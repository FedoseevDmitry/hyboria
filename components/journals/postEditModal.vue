<template>
  <div class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div
      class="bg-white dark:bg-gray-900 rounded shadow-lg w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col"
    >
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-bold">Редактировать запись</h2>
      </div>

      <form @submit.prevent="submitPost" class="flex-1 overflow-y-auto p-6 space-y-4">
        <div>
          <label class="block text-sm mb-1">Заголовок</label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div class="flex flex-col flex-1 min-h-[300px]">
          <label class="block text-sm mb-1">Текст</label>
          <div class="flex-1 min-h-[300px]">
            <Editor v-model:content="form.content" class="h-full w-full" />
          </div>
        </div>

        <div class="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            💾 Сохранить
          </button>
          <button
            type="button"
            @click="$emit('close')"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            ✖ Отмена
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useToast } from 'vue-toastification'
import Editor from '~/components/editor.vue'

const props = defineProps({ post: Object })
const emit = defineEmits(['close', 'updated'])

const toast = useToast()

const form = reactive({
  title: props.post.title,
  content: props.post.content
})

const submitPost = async () => {
  try {
    const updated = await $fetch(`/api/journals/posts/${props.post.id}`, {
      method: 'PATCH',
      body: {
        title: form.title,
        content: form.content
      }
    })
    toast.success('Запись обновлена!')
    emit('updated', updated)
    emit('close')
  } catch (err) {
    toast.error(err?.data?.message || err?.message || 'Ошибка при обновлении записи')
  }
}
</script>
