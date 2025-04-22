<script setup>
const { data: profile, pending, error } = await useFetch('/api/profile')

const roleNames = {
  user: 'Пользователь',
  admin: 'Администратор'
}

</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Профиль</h1>

    <div v-if="pending" class="text-gray-500 dark:text-gray-400">Загрузка...</div>
    <div v-else-if="error" class="text-red-600 dark:text-red-400">Ошибка: {{ error.message }}</div>

    <div
      v-else-if="profile"
      class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 transition-colors"
    >
      <div class="flex items-center space-x-6 mb-6">
        <img
          :src="profile.image"
          alt="Avatar"
          class="w-24 h-24 rounded-full ring-2 ring-indigo-500"
        />
        <div>
          <p class="text-2xl font-semibold text-gray-900 dark:text-white">
            {{ profile.name }}
          </p>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Email: {{ profile.email }}
          </p>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Зарегистрирован: {{ new Date(profile.created_at).toLocaleDateString('ru-RU') }}
          </p>
        </div>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
        <p class="text-gray-700 dark:text-gray-300">
          <span class="font-medium">Роль: {{ roleNames[profile.role] || 'Неизвестно' }}</span>
        </p>
        <p class="text-gray-700 dark:text-gray-300">
          <span class="font-medium">Дневников:</span> {{ profile.journalCount }}
        </p>

        <NuxtLink
          to="/settings"
          class="inline-block mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow transition-colors"
        >
          Настройки профиля
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
