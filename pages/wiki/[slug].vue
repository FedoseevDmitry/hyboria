<template>
  <div
    class="max-w-3xl mx-auto p-6 transition-colors"
    :class="colorMode.value === 'dark' ? 'text-white' : 'text-black'"
  >
    <!-- Кнопка назад -->
    <NuxtLink
      to="/wiki"
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

    <h1 class="text-2xl font-bold mb-4">
      {{ article.title }}
    </h1>

    <div class="whitespace-pre-line text-gray-700 dark:text-gray-300">
      {{ article.content }}
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { data: article } = await useFetch(`/api/wiki/${route.params.slug}`)
const colorMode = useColorMode()
</script>
