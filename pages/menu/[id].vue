<template>
  <div class="h-screen w-full overflow-hidden">
    <!-- Top Bar -->
    <div class="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-6 z-10">
      <button 
        @click="router.back()"
        class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
      >
        ← Back to My Menus
      </button>

      <div class="flex-1 text-center font-medium text-sm text-gray-500 truncate px-4">
        {{ currentMenu?.name }}
      </div>

      <div class="w-24"></div> <!-- Spacer for balance -->
    </div>

    <!-- Full Size Menu -->
    <iframe
      v-if="currentMenu"
      :src="currentMenu.url"
      class="w-full h-[calc(100vh-56px)] border-none"
      title="Restaurant Menu"
      allowfullscreen
    />
    
    <div v-else class="flex items-center justify-center h-full">
      <p class="text-xl text-gray-500">Menu not found</p>
    </div>
  </div>
</template>

<script setup>
import { useMenuStore } from '~/stores/menu'
import { useRoute } from 'vue-router'

const route = useRoute()
const menuStore = useMenuStore()
const router = useRouter()

const currentMenu = computed(() => 
  menuStore.menus.find(m => m.id === route.params.id)
)

// Optional: Update last visited time when opening
watch(() => currentMenu.value, (menu) => {
  if (menu) {
    menuStore.updateLastVisited(menu.id)
  }
}, { immediate: true })
</script>