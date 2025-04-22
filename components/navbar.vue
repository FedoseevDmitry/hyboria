<template>
  <nav class="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 shadow">
    <NuxtLink to="/" class="text-xl font-bold text-gray-900 dark:text-white">
      Hyboria
    </NuxtLink>

    <div class="flex gap-6 items-center text-sm">
      <NuxtLink
        to="/news"
        :class="[ 
          'hover:underline',
          isActive('/news') ? activeClass : inactiveClass
        ]"
      >
        Новости
      </NuxtLink>

      <NuxtLink
        to="/wiki"
        :class="[ 
          'hover:underline',
          isActive('/wiki') ? activeClass : inactiveClass
        ]"
      >
        Wiki
      </NuxtLink>

      <NuxtLink
        to="/journals"
        :class="[ 
          'hover:underline',
          isActive('/journals') ? activeClass : inactiveClass
        ]"
      >
        Дневники персонажей
      </NuxtLink>

      <!-- Кнопка для админов -->
      <template v-if="session && session.user.role === 'admin'">
        <NuxtLink
          to="/admin"
          :class="[ 
            'hover:underline',
            isActive('/admin') ? activeClass : inactiveClass
          ]"
        >
          Админ-панель
        </NuxtLink>
      </template>

      <button
        @click="toggleTheme"
        class="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white text-lg"
        title="Переключить тему"
      >
        {{ colorMode.value === 'dark' ? '🌙' : '☀️' }}
      </button>

      <div v-if="status === 'loading'" class="text-gray-400">Загрузка...</div>

      <template v-else-if="!session">
        <button
          @click="signIn('discord')"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
        >
          Войти
        </button>
      </template>

      <template v-else>
        <NuxtLink
          to="/profile"
          :class="[ 
            'hover:underline',
            isActive('/profile') ? activeClass : inactiveClass
          ]"
        >
          {{ session.user.name || 'Профиль' }}
        </NuxtLink>
        <button
          @click="signOut"
          class="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
        >
          Выйти
        </button>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useColorMode } from '#imports'

const route = useRoute()
const { data: session, status, signIn, signOut } = useAuth()
const colorMode = useColorMode()

function isActive(path) {
  return route.path.startsWith(path)
}

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const activeClass = 'text-indigo-600 font-semibold dark:text-indigo-400'
const inactiveClass = 'text-gray-700 dark:text-gray-300'
</script>
