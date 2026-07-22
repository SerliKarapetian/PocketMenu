<template>
  <div class="relative mb-6 sm:mb-8">
    <input
      v-model="searchTerm"
      type="text"
      placeholder="Search restaurants or dishes..."
      class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-3 pl-14  hover:border-black dark:hover:border-white transition text-sm sm:text-base"
      @input="$emit('search', searchTerm)"
    />
    <span
      class="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
    >
      🔍
    </span>
  </div>
</template>

<script setup>
const searchTerm = ref("");
</script>
