<template>
  <footer :class="footerClasses" class="text-center text-sm py-6 mt-12 transition-colors">
    © 2025 Hyboria. Все права защищены.
  </footer>
</template>

<script setup>
import { useColorMode } from '#imports'
import { computed, ref, onMounted } from 'vue'

const colorMode = useColorMode()

// Глобальное состояние для загрузки темы
const themeLoaded = ref(false)

// Загружаем тему в компоненте футера
onMounted(() => {
  if (process.client) {
    const savedTheme = localStorage.getItem('hyboria-color-mode')
    if (savedTheme) {
      colorMode.preference = savedTheme
    } else {
      colorMode.preference = 'dark' // По умолчанию
    }
    themeLoaded.value = true
  }
})

// Классы для футера
const footerClasses = computed(() => {
  if (!themeLoaded.value) {
    return '' // Пока тема не загружена, не задаем классы
  }
  return colorMode.value === 'dark' ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-500'
})
</script>
