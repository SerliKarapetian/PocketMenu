<!-- components/themeSwitch.vue -->
<template>
  <button
    @click="toggleTheme"
    class="flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative group"
    aria-label="Toggle theme"
  >
    <Icon
      :name="isDark ? 'mdi:weather-sunny' : 'mdi:weather-night'"
      class="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
    />
    <span
      class="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
    >
      {{ isDark ? "Light" : "Dark" }}
    </span>
  </button>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme();
</script>
