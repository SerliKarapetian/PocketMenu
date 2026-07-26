<template>
  <div class="h-screen w-full flex flex-col overflow-hidden">
    <!-- Full Screen Menu -->
    <iframe
      v-if="currentMenu"
      :src="currentMenu.url"
      class="flex-1 w-full border-none"
      title="Restaurant Menu"
      allowfullscreen
    />
    <div v-else class="flex-1 flex items-center justify-center">
      <p class="text-xl text-gray-500">Menu not found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMenuStore } from "~/stores/menu";

definePageMeta({
  layout: "default",
  layoutConfig: {
    pageTitle: "Menu",
    showBackButton: true,
  },
});

const route = useRoute();
const router = useRouter();
const menuStore = useMenuStore();

const currentMenu = computed(() =>
  menuStore.menus.find((m) => m.id === route.params.id),
);

watch(
  currentMenu,
  (menu) => {
    if (menu) {
      menuStore.updateLastVisited(menu.id);
      // Update the page title dynamically
      const meta = route.meta.layoutConfig as any;
      if (meta) {
        meta.pageTitle = menu.name;
      }
    }
  },
  { immediate: true },
);
</script>
