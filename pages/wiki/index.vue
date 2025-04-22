<template>
  <div
    class="max-w-4xl mx-auto p-6 transition-colors"
    :class="colorMode.value === 'dark' ? 'text-white' : 'text-black'"
  >
    <h1 class="text-3xl font-bold mb-6">WIKI</h1>

    <div v-if="!articles?.length" class="text-gray-500 dark:text-gray-400">
      Пока нет статей
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="a in articles"
        :key="a.id"
        class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow"
      >
        <NuxtLink :to="`/wiki/${a.slug}`">
          <h2 class="hover:underline text-blue-600 dark:text-blue-400 font-semibold text-xl mb-2">
            {{ a.title }}
          </h2>
        </NuxtLink>
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {{ a.content.slice(0, 150) }}...
        </p>
        <div class="flex justify-end">
          <NuxtLink
            :to="`/wiki/${a.slug}`"
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
const { data: articles } = await useFetch('/api/wiki')
const colorMode = useColorMode()
</script>
