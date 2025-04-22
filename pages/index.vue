<template>
  <div>
    <!-- Hero -->
    <section
      class="text-center py-20 px-6 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900 dark:to-gray-800 transition-colors"
    >
      <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        Добро пожаловать в Hyboria
      </h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
        Hyboria — это ролевая платформа нового поколения. Блоги, общение, личные истории — всё в одном месте.
      </p>
    </section>

    <!-- Новости -->
    <section class="px-6 py-12 max-w-5xl mx-auto">
      <h2 class="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Последние новости
      </h2>

      <div v-if="!news?.length" class="text-gray-500 dark:text-gray-400">
        Новостей пока нет.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in news"
          :key="item.id"
          class="bg-white shadow p-4 rounded dark:bg-gray-800 transition-colors"
        >
          <h3 class="font-bold text-lg mb-2 text-gray-900 dark:text-white">
            {{ item.title }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            {{ item.content.slice(0, 100) }}...
          </p>
          <NuxtLink
            :to="`/news/${item.slug}`"
            class="text-indigo-600 text-sm mt-2 inline-block dark:text-indigo-400"
          >
            Читать далее →
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { data: news } = await useFetch('/api/news')
</script>
