<template>
  <div :class="themeClasses" class="min-h-screen flex flex-col transition-colors">
    <Navbar />
    <div v-if="!themeLoaded" class="preloader">
      <!-- Прелоадер с темным фоном -->
      <div class="loader"></div>
    </div>
    <main class="flex-1">
      <!-- Скелетон для страницы -->
      <div v-if="!themeLoaded" class="skeleton skeleton-page">
        <div class="skeleton-header"></div>
        <div class="skeleton-content"></div>
        <div class="skeleton-footer"></div>
      </div>
      <NuxtPage v-else />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { useColorMode, useHead } from '#imports'
import { ref, computed, onMounted } from 'vue'
import Navbar from '~/components/navbar.vue'
import Footer from '~/components/footer.vue'

const colorMode = useColorMode()
const themeLoaded = ref(false)

useHead({
  htmlAttrs: {
    class: colorMode.preference
  }
})

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

const themeClasses = computed(() => {
  if (!themeLoaded.value) {
    return '' // Пока тема не загружена, не задаем классы
  }
  return colorMode.value === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
})
</script>

<style scoped>
/* Стиль для прелоадера с темным фоном */
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000000;
  z-index: 9999;
}

.loader {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Стили для скелетона */
.skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.skeleton-header, .skeleton-content, .skeleton-footer {
  background-color: #e0e0e0;
  border-radius: 4px;
  animation: skeleton-loading 1.5s infinite ease-in-out;
}

.skeleton-header {
  height: 40px;
  width: 100%;
}

.skeleton-content {
  height: 200px;
  width: 100%;
}

.skeleton-footer {
  height: 30px;
  width: 80%;
  margin: 0 auto;
}

@keyframes skeleton-loading {
  0% { background-color: #e0e0e0; }
  50% { background-color: #f7f7f7; }
  100% { background-color: #e0e0e0; }
}

/* Темный фон для темы */
.skeleton-page {
  background-color: #121212; /* Темный фон для скелетона */
}
</style>
