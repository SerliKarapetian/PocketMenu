<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
    >
      <h1 class="text-3xl sm:text-4xl font-bold">My Menus</h1>

      <NuxtLink
        to="/add"
        class="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl font-medium flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition w-full sm:w-auto"
      >
        <span class="text-xl">+</span> Add Menu
      </NuxtLink>
    </div>

    <!-- Search and Sort Row -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
      <div class="flex-1">
        <SearchBar @search="handleSearch" />
      </div>
      <div class="sm:flex-shrink-0">
        <SortDropdown v-model="sortBy" />
      </div>
    </div>

    <div v-if="menus.length === 0" class="text-center py-16 sm:py-20">
      <p class="text-2xl text-gray-400 mb-4">No menus saved yet</p>
      <NuxtLink to="/add" class="text-blue-600 hover:underline text-lg">
        Add your first menu →
      </NuxtLink>
    </div>

    <!-- Grid -->
    <div
      class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
    >
      <MenuCard
        v-for="menu in sortedAndFilteredMenus"
        :key="menu.id"
        :menu="menu"
        @delete="deleteMenu"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMenuStore } from "~/stores/menu";

definePageMeta({ layout: "default" });

const menuStore = useMenuStore();
const searchTerm = ref("");
const sortBy = ref<"newest" | "oldest" | "az" | "za" | "lastVisited">("newest");

const menus = computed(() => menuStore.menus);

const filteredMenus = computed(() => {
  if (!searchTerm.value) return menus.value;
  return menus.value.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.value.toLowerCase()),
  );
});

const sortedAndFilteredMenus = computed(() => {
  const filtered = filteredMenus.value;

  switch (sortBy.value) {
    case "newest":
      return [...filtered].sort(
        (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
      );
    case "oldest":
      return [...filtered].sort(
        (a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime(),
      );
    case "az":
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    case "za":
      return [...filtered].sort((a, b) => b.name.localeCompare(a.name));
    case "lastVisited":
      return [...filtered].sort(
        (a, b) =>
          new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime(),
      );
    default:
      return filtered;
  }
});

const handleSearch = (term: string) => {
  searchTerm.value = term;
};

const deleteMenu = (id: string) => {
  if (confirm("Delete this menu?")) {
    menuStore.removeMenu(id);
  }
};
</script>
