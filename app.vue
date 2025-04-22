<template>
  <NuxtLayout />
</template>

<script setup>
import { useHead } from '#imports'

useHead({
  htmlAttrs: {
    class: 'dark' // если темная тема по умолчанию
  }
})
</script>