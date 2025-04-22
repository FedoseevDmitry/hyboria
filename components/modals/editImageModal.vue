<template>
  <div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Редактировать изображение</h2>
      
      <div class="space-y-4">
        <div>
          <label class="text-sm block mb-1 text-gray-700 dark:text-gray-300">Ширина (например, 200px или 50%)</label>
          <input
            v-model="local.width"
            class="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="auto"
          />
        </div>
        <div>
          <label class="text-sm block mb-1 text-gray-700 dark:text-gray-300">Обтекание</label>
          <select
            v-model="local.float"
            class="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Нет</option>
            <option value="left">Слева</option>
            <option value="right">Справа</option>
          </select>
        </div>
        <div>
          <label class="text-sm block mb-1 text-gray-700 dark:text-gray-300">Alt текст</label>
          <input
            v-model="local.alt"
            class="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div class="flex justify-between mt-6">
        <button
          @click="$emit('close')"
          class="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
        >
          Отмена
        </button>
        <button
          @click="$emit('save', local)"
          class="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
        >
          💾 Сохранить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ attrs: Object })
const local = ref({ ...props.attrs })
</script>
