<template>
  <aside class="w-64 h-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hidden md:flex flex-col p-4">
    <nav class="space-y-1">
      <SidebarLink to="/admin" icon="LayoutDashboard" label="Панель" />
      <SidebarLink to="/admin/users" icon="Users" label="Пользователи" />
      <SidebarLink to="/admin/settings" icon="Settings" label="Настройки" />
      <SidebarLink to="/" icon="ArrowLeftToLine" label="Вернуться на сайт" />
    </nav>
  </aside>
</template>

<script setup>
import SidebarLink from '~/components/admin/sidebarLink.vue'
</script>
