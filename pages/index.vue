<template>
  <div class="max-w-6xl mx-auto p-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-4xl font-bold">My Menus</h1>
      <NuxtLink
        to="/add"
        class="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl font-medium flex items-center gap-2 hover:scale-105 transition"
      >
        <span class="text-xl">+</span> Add Menu
      </NuxtLink>
    </div>

    <SearchBar @search="handleSearch" />

    <div v-if="menus.length === 0" class="text-center py-20">
      <p class="text-2xl text-gray-400 mb-4">No menus saved yet</p>
      <NuxtLink to="/add" class="text-blue-600 hover:underline">
        Add your first menu →
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MenuCard
        v-for="menu in filteredMenus"
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

const menus = computed(() => menuStore.menus);
const filteredMenus = computed(() => {
  if (!searchTerm.value) return menus.value;
  return menus.value.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.value.toLowerCase()),
  );
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
