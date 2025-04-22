<template>
  <button
    class="editor-btn"
    :class="[
      active
        ? 'bg-indigo-600 text-white'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
    ]"
    @click="$emit('click')"
    :title="tooltip"
    type="button"
  >
    <component :is="iconComponent" class="w-4 h-4" />
  </button>
</template>

<script setup>
import * as icons from 'lucide-vue-next'
import { computed } from 'vue'
import { resolveDynamicComponent } from 'vue'

const props = defineProps({
  icon: String,
  active: Boolean,
  tooltip: String,
})
defineEmits(['click'])

const iconComponent = computed(() => resolveDynamicComponent(icons[props.icon] || 'div'))
</script>

<style scoped>
.editor-btn {
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}
</style>
