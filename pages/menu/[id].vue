<template>
  <div class="h-screen w-full flex flex-col overflow-hidden">
    <!-- Top Navigation Bar -->
    <div
      class="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 sm:px-6 z-10 flex-shrink-0"
    >
      <button
        @click="router.back()"
        class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition pr-4"
      >
        ← <span class="hidden sm:inline">Back to My Menus</span>
      </button>

      <div
        class="flex-1 text-center font-medium text-sm sm:text-base text-gray-600 dark:text-gray-400 truncate px-2"
      >
        {{ currentMenu?.name }}
      </div>

      <div class="w-10 sm:w-24"></div>
    </div>

    <!-- Full Screen Menu -->
    <iframe
      v-if="currentMenu"
      :src="currentMenu.url"
      class="flex-1 w-full border-none"
      title="Restaurant Menu"
      allowfullscreen
    />

    <div
      v-else
      class="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-950"
    >
      <p class="text-xl text-gray-500">Menu not found</p>
    </div>
  </div>
</template>

<script setup>
import { useMenuStore } from "~/stores/menu";
import { useRoute } from "vue-router";

const route = useRoute();
const menuStore = useMenuStore();
const router = useRouter();

const currentMenu = computed(() =>
  menuStore.menus.find((m) => m.id === route.params.id),
);

// Update last visited time when opening
watch(
  () => currentMenu.value,
  (menu) => {
    if (menu) {
      menuStore.updateLastVisited(menu.id);
    }
  },
  { immediate: true },
);
</script>
