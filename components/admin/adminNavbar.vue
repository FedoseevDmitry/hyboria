<template>
  <header class="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
    <!-- Логотип -->
    <div class="flex items-center gap-2">
      <LucideLayoutDashboard class="w-5 h-5" />
      <NuxtLink to="/admin" class="text-lg font-semibold hover:opacity-80">Админ-панель</NuxtLink>
    </div>

    <!-- Правая часть -->
    <div class="flex items-center gap-4">
      <!-- Переключатель темы -->
      <button @click="toggleTheme" class="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white text-xl">
        <span v-if="colorMode.value === 'dark'">🌙</span>
        <span v-else>☀️</span>
      </button>

      <!-- Профиль -->
      <NuxtLink to="/profile" class="flex items-center gap-2 text-sm hover:underline">
        <LucideUser class="w-4 h-4" />
        {{ session?.user?.name || 'Профиль' }}
      </NuxtLink>
    </div>
  </header>
</template>

<script setup>
import { useColorMode } from '#imports'
import { LucideLayoutDashboard, LucideUser } from 'lucide-vue-next'

const colorMode = useColorMode()

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
