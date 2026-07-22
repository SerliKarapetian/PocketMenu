<template>
  <div
    class="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-xl transition group"
  >
    <div
      class="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-6xl"
    >
      🍽️
    </div>

    <div class="p-5">
      <h3 class="font-semibold text-xl mb-1">{{ menu.name }}</h3>
      <p class="text-sm text-gray-500 mb-4">
        Added {{ new Date(menu.addedAt).toLocaleDateString() }}
      </p>

      <div class="flex gap-3">
        <NuxtLink
          :to="`/menu/${menu.id}`"
          class="flex-1 bg-black dark:bg-white text-white dark:text-black text-center py-3 rounded-2xl font-medium hover:scale-105 transition"
        >
          Open Menu
        </NuxtLink>

        <button
          @click="emit('delete', menu.id)"
          class="px-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-2xl transition"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Menu } from "~/types/menu";

defineProps<{
  menu: Menu;
}>();

const emit = defineEmits<{
  delete: [id: string];
}>();
</script>
