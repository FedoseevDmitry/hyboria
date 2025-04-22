<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen gap-4 transition-colors"
    :class="colorMode.value === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'"
  >
    <h1 class="text-2xl font-bold">
      Секретная страница
    </h1>
    <p v-if="session">
      Ты вошёл как {{ session.user.name || session.user.email }}
    </p>
  </div>
</template>

<script setup>
const { status, data: session } = useAuth()
const colorMode = useColorMode() // для работы с темой

definePageMeta({ auth: true })

if (status.value === 'unauthenticated') {
  navigateTo('/')
}
</script>
