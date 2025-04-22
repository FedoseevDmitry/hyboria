<template>
  <div class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6 relative">
      <h2 class="text-lg font-bold mb-4">Добавить изображение</h2>

      <form @submit.prevent="submit" class="space-y-5">
        <!-- Загрузка файла -->
        <div>
          <label class="block text-sm mb-1">Загрузить файл</label>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleFileChange"
            class="w-full text-sm"
          />
        </div>

        <!-- Или вставка по URL -->
        <div class="text-center text-gray-400 dark:text-gray-500">или</div>

        <div>
          <label class="block text-sm mb-1">Вставить URL</label>
          <input
            v-model="url"
            type="url"
            placeholder="https://example.com/image.jpg"
            class="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <!-- Предпросмотр -->
        <div v-if="preview" class="mt-4">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Предпросмотр:</p>
          <img
            :src="preview"
            alt="Предпросмотр"
            class="max-h-48 w-auto rounded border dark:border-gray-700 mb-2"
          />
          <button
            type="button"
            @click="clearPreview"
            class="text-sm text-red-600 hover:text-red-800"
          >
            ✖ Удалить изображение
          </button>
        </div>

        <!-- Кнопки -->
        <div class="flex justify-between pt-4">
          <button
            type="submit"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            🖼️ Вставить
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
import { ref, watch } from 'vue'
import { useToast } from 'vue-toastification'

const emit = defineEmits(['close', 'uploaded'])

const fileInput = ref(null)
const url = ref('')
const preview = ref(null)
const toast = useToast()

const handleFileChange = () => {
  const file = fileInput.value?.files?.[0]
  if (file) {
    preview.value = URL.createObjectURL(file)
    url.value = '' // сброс URL если выбран файл
  }
}

watch(url, (val) => {
  if (val) {
    preview.value = val
    if (fileInput.value) {
      fileInput.value.value = '' // сброс файла если введён URL
    }
  } else if (!fileInput.value?.files?.length) {
    preview.value = null
  }
})

const clearPreview = () => {
  preview.value = null
  url.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const submit = async () => {
  const file = fileInput.value?.files?.[0]

  if (file) {
    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await $fetch('/api/uploads/image', {
        method: 'POST',
        body: formData
      })
      emit('uploaded', res.imageUrl)
      emit('close')
      toast.success('Изображение загружено!')
      return
    } catch (err) {
      toast.error('Ошибка загрузки изображения')
      return
    }
  }

  if (url.value) {
    emit('uploaded', url.value)
    emit('close')
    return
  }

  toast.error('Выберите файл или введите ссылку')
}
</script>
