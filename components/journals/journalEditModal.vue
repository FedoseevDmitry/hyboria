<template>
  <div class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
    <div class="bg-white dark:bg-gray-900 p-6 rounded shadow-lg w-full max-w-lg relative">
      <h2 class="text-xl font-bold mb-4">Редактировать дневник</h2>

      <form @submit.prevent="submitEdit" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Имя персонажа</label>
          <input
            v-model="form.characterName"
            type="text"
            class="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label class="block text-sm mb-1">Описание</label>
          <textarea
            v-model="form.description"
            rows="4"
            class="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          ></textarea>
        </div>

        <input type="file" @change="handleImageUpload" accept="image/*" />

        <div class="flex justify-between items-center mt-6">
          <button
            type="submit"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            💾 Сохранить
          </button>

          <button
            type="button"
            @click="showConfirm = true"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            🗑 Удалить дневник
          </button>
        </div>
      </form>

      <button
        @click="$emit('close')"
        class="absolute top-4 right-6 text-gray-400 hover:text-gray-700 dark:hover:text-white"
        title="Закрыть"
      >
        ✕
      </button>
    </div>
  </div>

  <!-- Кастомное окно подтверждения -->
  <confirmDialog
    v-if="showConfirm"
    title="Удаление дневника"
    message="Вы уверены, что хотите удалить этот дневник вместе со всеми записями?"
    @confirm="handleDeleteConfirmed"
    @cancel="showConfirm = false"
  />
</template>

<script setup>
import { useToast } from 'vue-toastification'
import { reactive, ref } from 'vue'
import { navigateTo } from '#app'
import confirmDialog from '~/components/ui/confirmDialog.vue'

const props = defineProps({
  journal: Object
})
const emit = defineEmits(['close', 'updated', 'deleted'])

const toast = useToast()
const showConfirm = ref(false)

const form = reactive({
  characterName: props.journal.characterName,
  description: props.journal.description,
  image: props.journal.image || ''
})


const submitEdit = async () => {
  try {
    const res = await $fetch(`/api/journals/${props.journal.slug}`, {
      method: 'PATCH',
      body: {
        characterName: form.characterName,
        description: form.description,
        image: form.image // ← это добавь!
      }
    })
    toast.success('Дневник обновлён')
    emit('updated')
    emit('close')
  } catch (err) {
    console.error('❌ Ошибка при сохранении:', err)
    toast.error(
      err?.data?.message || err?.message || 'Ошибка при обновлении дневника'
    )
  }
}

import { nextTick } from 'vue'

const handleDeleteConfirmed = async () => {
  showConfirm.value = false
  try {
    await $fetch(`/api/journals/${props.journal.slug}`, {
      method: 'DELETE'
    })

    toast.success('Дневник удалён')

    emit('deleted')
    emit('close')

    await nextTick() // ✅ дождаться обновления DOM, чтобы избежать гонки

    navigateTo('/journals') // 🔁 теперь можно переходить
  } catch (err) {
    console.error('Ошибка при удалении дневника:', err)
    toast.error(err?.data?.message || err?.message || 'Ошибка при удалении')
  }
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('image', file)

  try {
    const res = await $fetch(`/api/journals/${props.journal.slug}/upload-image`, {
      method: 'POST',
      body: formData
    })
    form.image = res.imageUrl // ✅ сохранить результат
    toast.success('Изображение загружено')
  } catch (err) {
    console.error('Ошибка загрузки изображения:', err)
    toast.error('Не удалось загрузить изображение')
  }
}

</script>
