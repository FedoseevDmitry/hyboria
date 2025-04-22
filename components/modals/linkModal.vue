<template>
  <div class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6 relative">
      <h2 class="text-lg font-bold mb-4">Вставить ссылку</h2>

      <form @submit.prevent="submitLink" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Ссылка (URL)</label>
          <input
            v-model="url"
            type="url"
            placeholder="https://example.com"
            required
            class="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label class="block text-sm mb-1">Текст ссылки (необязательно)</label>
          <input
            v-model="text"
            type="text"
            placeholder="Текст ссылки"
            class="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div class="flex justify-between pt-2">
          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            🔗 Вставить
          </button>
          <button
            type="button"
            @click="$emit('close')"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            ✖ Отмена
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'insert'])

const url = ref('')
const text = ref('')

const submitLink = () => {
  if (!url.value) return
  emit('insert', { url: url.value, text: text.value })
  emit('close')
}
</script>
