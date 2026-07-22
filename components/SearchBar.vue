<template>
  <div class="relative mb-8">
    <input
      v-model="searchTerm"
      type="text"
      placeholder="Search restaurants or dishes..."
      class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-3xl px-6 py-4 pl-12 focus:outline-none focus:border-black dark:focus:border-white transition"
      @input="$emit('search', searchTerm)"
    />
    <span class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
      >🔍</span
    >
  </div>
</template>

<script setup>
const searchTerm = ref("");
</script>
