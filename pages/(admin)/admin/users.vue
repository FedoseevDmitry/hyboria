<template>
  <div class="space-y-6">
    <!-- Заголовок и фильтры -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <h1 class="text-2xl font-semibold">Пользователи</h1>
      <div class="flex flex-col sm:flex-row gap-2">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Поиск по имени"
          class="border px-3 py-1 rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <select
          v-model="selectedRole"
          class="border px-3 py-1 rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="">Все роли</option>
          <option value="user">Пользователь</option>
          <option value="admin">Админ</option>
        </select>
      </div>
    </div>

    <!-- Ошибка -->
    <div v-if="error" class="text-red-500">Ошибка: {{ error.message }}</div>

    <!-- Загрузка -->
    <div v-else-if="pending" class="text-gray-500">Загрузка...</div>

    <!-- Таблица -->
    <div v-else class="overflow-y-hidden rounded border border-gray-200 dark:border-gray-700">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-4 py-2 text-left text-sm font-semibold">Логин</th>
            <th class="px-4 py-2 text-left text-sm font-semibold">Email</th>
            <th class="px-4 py-2 text-left text-sm font-semibold">Роль</th>
            <th class="px-4 py-2 text-left text-sm font-semibold">Дата регистрации</th>
            <th class="px-4 py-2 text-left text-sm font-semibold">Доступ к дневникам</th>
            <th class="px-4 py-2 text-right text-sm font-semibold">Действия</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700">
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td class="px-4 py-2">{{ user.name }}</td>
            <td class="px-4 py-2">{{ user.email }}</td>
            <td class="px-4 py-2">{{ roleLabels[user.role] || user.role }}</td>
            <td class="px-4 py-2">{{ formatDate(user.created_at) }}</td>
            <td class="px-4 py-2">{{ journalLabels[user.canCreateJournals] || user.canCreateJournals }}</td>
            <td class="px-4 py-2 text-right">
              <button
                class="text-sm px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                @click="openEdit(user)"
              >
                Изменить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Пагинация -->
    <div class="flex justify-between items-center mt-4">
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Страница {{ currentPage }} из {{ totalPages }}
      </div>
      <div class="flex gap-2">
        <button
          class="px-3 py-1 rounded border text-sm dark:border-gray-600"
          @click="prevPage"
          :disabled="currentPage === 1"
        >
          ← Пред
        </button>
        <button
          class="px-3 py-1 rounded border text-sm dark:border-gray-600"
          @click="nextPage"
          :disabled="currentPage === totalPages"
        >
          След →
        </button>
      </div>
    </div>

    <!-- Модальное окно -->
    <UserEditModal
      v-if="selectedUser"
      :user="selectedUser"
      :visible="showModal"
      @close="closeEdit"
      @saved="refreshUsers"
      @deleted="refreshUsers"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useFetch } from '#app'
import UserEditModal from '~/components/admin/userEditModal.vue'

const selectedRole = ref('')
const selectedUser = ref(null)
const showModal = ref(false)
const searchTerm = ref('')
const currentPage = ref(1)
const pageSize = 10

const roleLabels = {
  user: 'Пользователь',
  admin: 'Админ'
}

const journalLabels = {
  true: 'Разрешен',
  false: 'Запрещен'
}

// Загрузка пользователей
const { data, error, pending, refresh } = await useFetch('/api/admin/users')
const users = ref(data.value || [])

const refreshUsers = async () => {
  await refresh()
  users.value = data.value
}

const formatDate = (d) => new Date(d).toLocaleDateString('ru-RU')

// Поиск + фильтр по роли
const filteredUsers = computed(() => {
  let result = users.value

  if (selectedRole.value) {
    result = result.filter(u => u.role === selectedRole.value)
  }

  if (searchTerm.value.trim()) {
    const term = searchTerm.value.trim().toLowerCase()
    result = result.filter(u => u.name.toLowerCase().includes(term))
  }

  return result
})

// Пагинация
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredUsers.value.slice(start, start + pageSize)
})

// Переключение страниц
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

// Сброс страницы при смене фильтра/поиска
watch([selectedRole, searchTerm], () => {
  currentPage.value = 1
})

// Модалка редактирования
const openEdit = (user) => {
  selectedUser.value = user
  showModal.value = true
}
const closeEdit = () => {
  selectedUser.value = null
  showModal.value = false
}
</script>
