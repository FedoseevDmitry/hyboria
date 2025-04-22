<template>
  <NuxtLink
    :to="to"
    class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors"
    :class="isActive ? activeClass : inactiveClass"
  >
    <component :is="iconComponent" class="w-4 h-4 shrink-0" />
    <span>{{ label }}</span>
  </NuxtLink>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import * as icons from 'lucide-vue-next'

const props = defineProps({
  to: String,
  label: String,
  icon: String
})

const route = useRoute()

const isActive = computed(() => route.path === props.to)
const iconComponent = computed(() => icons[props.icon])

const activeClass = 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
const inactiveClass = 'text-gray-600 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
</script>
