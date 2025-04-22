<template>
  <div
    class="max-w-4xl mx-auto p-6 transition-colors"
    :class="colorMode.value === 'dark' ? 'text-white' : 'text-black'"
  >
    <h1 class="text-3xl font-bold mb-6">
      Новости
    </h1>

    <div v-if="!news?.length" class="text-gray-500 dark:text-gray-400">
      Пока нет новостей
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="n in news"
        :key="n.id"
        class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow"
      >
        <NuxtLink :to="`/news/${n.slug}`">
          <img
            v-if="n.image"
            :src="n.image"
            alt="Изображение новости"
            class="w-full h-48 object-cover rounded mb-4"
          />
          <h2 class="hover:underline text-blue-600 dark:text-blue-400 font-semibold text-xl mb-2">
            {{ n.title }}
          </h2>
        </NuxtLink>
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {{ n.content.slice(0, 150) }}...
        </p>
        <div class="flex justify-end">
          <NuxtLink
            :to="`/news/${n.slug}`"
            class="text-blue-600 dark:text-blue-400 text-sm font-medium"
          >
            Читать далее
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: news } = await useFetch('/api/news')
const colorMode = useColorMode()
</script>
