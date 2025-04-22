<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md text-sm relative">
      <h2 class="text-lg font-semibold mb-4">{{ title }}</h2>
      <p class="text-gray-700 dark:text-gray-300 mb-6">{{ message }}</p>

      <div class="flex justify-end gap-3">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 rounded border dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Отмена
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
        >
          Удалить
        </button>
      </div>

      <button
        @click="$emit('cancel')"
        class="absolute top-3 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  message: String
})

defineEmits(['confirm', 'cancel'])
</script>
