<template>
  <div class="relative p-6">
    <div v-if="journal">
      <!-- Меню справа -->
      <aside
        class="hidden lg:block absolute top-6 right-6 w-72 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-4 text-sm"
      >
        <h2 class="text-xl font-bold mb-2">{{ journal.characterName }}</h2>
        <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line mb-8">
          {{ journal.description }}
        </p>
        <div class="flex items-center gap-3 mb-4">
          <img
            v-if="journal.user?.image"
            :src="journal.user.image"
            alt="Аватар"
            class="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
          />
          <div>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ journal.user?.name || 'Неизвестен' }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Автор дневника
            </p>
          </div>
        </div>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          🗓 Создан: {{ formatDateTime(journal.created_at) }}
        </p>

        <div v-if="canEdit" class="mt-4 space-y-2">
          <button
            @click="showEdit = true"
            class="w-full text-sm px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            ✏️ Редактировать дневник
          </button>
          <button
            @click="showCreate = true"
            class="w-full text-sm px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            ➕ Добавить запись
          </button>
        </div>
      </aside>

      <!-- Контент по центру -->
      <div class="max-w-5xl mx-auto">
        <div v-if="posts?.length">
          <div
            v-for="post in posts"
            :key="post.id"
            class="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6"
          >
            <h2 class="text-xl font-semibold mb-2">{{ post.title }}</h2>
            <div class="text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none mb-2" v-html="post.content" />
            <p class="text-sm text-gray-500 dark:text-gray-400">
              🕒 {{ formatDateTime(post.created_at) }}
            </p>
          </div>
        </div>
        <div v-else class="text-gray-400 dark:text-gray-500">
          Пока нет записей в этом дневнике.
        </div>
      </div>

      <JournalEditModal
        v-if="showEdit"
        :journal="journal"
        @close="showEdit = false"
        @updated="refreshJournal"
        @deleted="onDeleted"
      />

      <NewPostModal
        v-if="showCreate"
        :slug="journal.slug"
        @close="showCreate = false"
        @created="refreshPosts"
      />
    </div>

    <div v-else class="text-center text-gray-500 dark:text-gray-400 p-6">
      Загрузка...
    </div>
  </div>
</template>

<script setup>
import JournalEditModal from '~/components/journals/journalEditModal.vue'
import NewPostModal from '~/components/journals/newPostModal.vue'

const route = useRoute()
const { data: session } = useAuth()
const { data: journal } = await useFetch(`/api/journals/${route.params.slug}`)
const { data: posts, refresh: refreshPosts } = await useFetch(`/api/journals/${route.params.slug}/posts`)
const showEdit = ref(false)
const showCreate = ref(false)

const canEdit = computed(() => {
  return session.value?.user?.id === journal.value?.user?.id ||
    session.value?.user?.role === 'admin'
})

const refreshJournal = async () => {
  const res = await $fetch(`/api/journals/${route.params.slug}`)
  journal.value = res
}

const onDeleted = () => {
  navigateTo('/journals')
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
