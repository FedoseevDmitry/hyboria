<template>
  <div class="relative p-6">
    <template v-if="journal">
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
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          🕓 Обновлён: {{ formatDateTime(journal.updated_at) }}
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

            <div
              class="text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none mb-2"
              v-html="post.content"
            />

            <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              <p>🕒 {{ formatDateTime(post.created_at) }}</p>

              <div v-if="canEdit" class="flex gap-2">
                <button
                  @click="startEditing(post)"
                  class="text-blue-600 hover:text-blue-800"
                  title="Редактировать пост"
                >
                  ✏️
                </button>
                <button
                  @click="confirmDelete(post)"
                  class="text-red-600 hover:text-red-800"
                  title="Удалить пост"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-400 dark:text-gray-500">
          Пока нет записей в этом дневнике.
        </div>
      </div>

      <!-- Модалки -->
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

      <postEditModal
        v-if="editingPost"
        :post="editingPost"
        @updated="refreshPosts"
        @close="editingPost = null"
      />

      <confirmDialog
        v-if="showDeleteConfirm"
        title="Удаление записи"
        message="Вы уверены, что хотите удалить эту запись? Это действие нельзя отменить."
        @confirm="deletePost"
        @cancel="showDeleteConfirm = false"
      />
    </template>

    <template v-else>
      <div class="text-center text-gray-500 dark:text-gray-400 p-6">
        Загрузка...
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, navigateTo } from '#app'
import { useToast } from 'vue-toastification'
import JournalEditModal from '~/components/journals/journalEditModal.vue'
import NewPostModal from '~/components/journals/newPostModal.vue'
import postEditModal from '~/components/journals/postEditModal.vue'
import confirmDialog from '~/components/ui/confirmDialog.vue'

const postToDelete = ref(null)
const showDeleteConfirm = ref(false)


const route = useRoute()
const toast = useToast()

const { data: session } = useAuth()
const { data: journal } = await useFetch(`/api/journals/${route.params.slug}`)
const { data: posts, refresh: refreshPosts } = await useFetch(`/api/journals/${route.params.slug}/posts`)
const showEdit = ref(false)
const showCreate = ref(false)
const editingPost = ref(null)

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

const startEditing = (post) => {
  editingPost.value = post
}

const confirmDelete = (post) => {
  postToDelete.value = post
  showDeleteConfirm.value = true
}

const deletePost = async () => {
  if (!postToDelete.value) return

  try {
    await $fetch(`/api/journals/posts/${postToDelete.value.id}`, {
      method: 'DELETE'
    })
    toast.success('Пост удалён')
    showDeleteConfirm.value = false
    postToDelete.value = null
    await refreshPosts()
  } catch (err) {
    toast.error('Ошибка при удалении поста')
  }
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