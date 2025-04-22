<template>
  <div
    class="max-w-5xl mx-auto p-6 transition-colors"
    :class="colorMode.value === 'dark' ? 'text-white' : 'text-black'"
  >
    <h1 class="text-3xl font-bold mb-6">Дневники персонажей</h1>

    <div v-if="!journals?.length" class="text-gray-500 dark:text-gray-400">
      Пока нет дневников
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="j in journals"
        :key="j.id"
        class="flex flex-col justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow h-full"
      >

      <img
        v-if="j.image"
        :src="j.image"
        alt="Обложка дневника"
        class="w-full h-48 object-cover rounded mb-3 cursor-pointer"
        @click="openImageModal(j.image)"
      />
      <div>
        <NuxtLink :to="`/journals/${j.slug}`">
          <h2 class="hover:underline text-blue-600 dark:text-blue-400 font-semibold text-xl mb-2">
            {{ j.characterName }}
          </h2>
        </NuxtLink>
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {{ j.description || j.preview || 'Без описания...' }}
        </p>
      </div>
      <div class="flex justify-between items-end mb-2">
        <div class="text-xs text-gray-500 dark:text-gray-400">
          <div>Создан: {{ formatDateTime(j.created_at) }}</div>
          <div>Обновлён: {{ formatDateTime(j.updated_at) }}</div>
        </div>
        <NuxtLink
          :to="`/journals/${j.slug}`"
          class="text-blue-600 dark:text-blue-400 text-sm font-medium"
        >
          Читать →
        </NuxtLink>
      </div>
      </div>
    </div>
  </div>
  <!-- Модалка для просмотра картинки -->
  <div
    v-if="showImageModal"
    class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
    @click.self="closeImageModal"
  >
    <div class="relative max-w-3xl w-full">
      <button
        class="absolute top-2 right-2 text-white text-2xl"
        @click="closeImageModal"
        title="Закрыть"
      >
        ✕
      </button>
      <img :src="modalImageUrl" alt="Просмотр" class="max-h-[80vh] mx-auto rounded shadow-lg" />
    </div>
  </div>
</template>

<script setup>
const { data: journals } = await useFetch('/api/journals')
const colorMode = useColorMode()

const showImageModal = ref(false)
const modalImageUrl = ref('')

const openImageModal = (url) => {
  modalImageUrl.value = url
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
  modalImageUrl.value = ''
}

const formatDateTime = (d) =>
  new Date(d).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
</script>