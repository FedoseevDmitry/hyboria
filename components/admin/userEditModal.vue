<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
  >
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
      <h2 class="text-xl font-semibold">Редактировать пользователя</h2>

      <div class="space-y-2">
        <label class="block text-sm">Логин:</label>
        <input
          v-model="form.name"
          class="w-full border px-3 py-1 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />

        <label class="block text-sm mt-4">Роль:</label>
        <select
          v-model="form.role"
          class="w-full border px-3 py-1 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <option value="user">Пользователь</option>
          <option value="admin">Админ</option>
        </select>

        <label class="block text-sm mt-4">Аватар (URL):</label>
        <input
          v-model="form.image"
          class="w-full border px-3 py-1 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />

        <label class="inline-flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            v-model="form.canCreateJournals"
            class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800"
          />
          <span class="text-sm">Разрешено вести дневник</span>
        </label>
      </div>

      <div class="flex justify-between items-center mt-6">
        <button
          @click="onDelete"
          class="text-sm text-red-600 hover:underline"
        >
          Удалить
        </button>

        <div class="flex gap-2">
          <button
            @click="close"
            class="px-3 py-1 rounded border text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Отмена
          </button>
          <button
            @click="onSave"
            class="px-3 py-1 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, toRef } from 'vue'
import { useFetch } from '#app'

const props = defineProps({
  user: Object,
  visible: Boolean
})

const emit = defineEmits(['close', 'saved', 'deleted'])

const form = reactive({
  name: '',
  role: '',
  image: ''
})

watch(() => props.user, (newUser) => {
  if (newUser) {
    form.name = newUser.name
    form.role = newUser.role
    form.image = newUser.image || ''
    form.canCreateJournals = newUser.canCreateJournals || false
  }
}, { immediate: true })

function close() {
  emit('close')
}

async function onSave() {
  await useFetch(`/api/admin/user/${props.user.id}`, {
    method: 'PATCH',
    body: {
    name: form.name,
    role: form.role,
    image: form.image,
    canCreateJournals: form.canCreateJournals
  }
  })

  emit('saved')
  close()
}

async function onDelete() {
  if (confirm(`Удалить пользователя "${props.user.name}"?`)) {
    await useFetch(`/api/admin/user/${props.user.id}`, {
      method: 'DELETE'
    })

    emit('deleted')
    close()
  }
}
</script>