<template>
  <div class="flex flex-col min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
    <AdminNavbar />
    <div class="flex flex-1 overflow-hidden">
      <AdminSidebar />
      <main class="flex-1 p-6 overflow-auto">
        <NuxtPage/>
        <slot />
      </main>
    </div>
  </div>
</template>


<script setup>
import AdminNavbar from '~/components/admin/adminNavbar.vue'
import AdminSidebar from '~/components/admin/adminSidebar.vue'
definePageMeta({
  middleware: 'admin-only'
})
</script>
