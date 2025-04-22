<template>
  <div class="max-w-3xl mx-auto p-6">
    <!-- Кнопка назад -->
    <NuxtLink
      to="/news"
      class="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4"
    >
      <svg
        class="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Назад
    </NuxtLink>

    <div v-if="!news">
      <p class="text-gray-500 dark:text-gray-400">Новость не найдена.</p>
    </div>
    <div v-else>
      <img v-if="news.image" :src="news.image" class="mb-4 rounded" />
      <h1 class="text-3xl font-bold mb-4">{{ news.title }}</h1>
      <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
        {{ news.content }}
      </p>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()

const response = await useFetch('/api/news')

const newsArray = computed(() =>
  Array.isArray(response.data.value) ? response.data.value : []
)

const news = computed(() =>
  newsArray.value.find((n) => n.slug === route.params.slug)
)
</script>
