<!-- layouts/default.vue -->
<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100"
  >
    <!-- Navigation Bar -->
    <nav
      v-if="showNav"
      class="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-14 sm:h-16">
          <!-- Left side - Back button or logo -->
          <div class="flex items-center gap-3 min-w-[100px]">
            <button
              v-if="showBackButton && !isHomePage"
              @click="goBack"
              class="flex p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Go back"
            >
              <Icon name="mdi:arrow-left" class="w-5 h-5" />
            </button>

            <NuxtLink
              v-else
              to="/"
              class="flex items-center gap-2 font-bold text-lg hover:opacity-70 transition"
            >
              <span class="text-2xl">📱</span>
              <span class="hidden sm:inline">PocketMenu</span>
            </NuxtLink>
          </div>

          <!-- Center - Page Title -->
          <div
            class="font-medium text-sm sm:text-base truncate max-w-[40%] sm:max-w-[60%]"
          >
            {{ pageTitle }}
          </div>

          <!-- Right side - Actions -->
          <div class="flex items-center gap-2 min-w-[100px] justify-end">
            <themeSwitch v-if="showThemeToggle" />
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

// Use the theme composable
const { initTheme, listenForSystemThemeChanges } = useTheme();

// Get layout configuration from route meta
const routeConfig = computed(() => {
  return (
    (route.meta.layoutConfig as {
      showNav?: boolean;
      showBackButton?: boolean;
      showThemeToggle?: boolean;
      pageTitle?: string;
    }) || {}
  );
});

// Computed properties from route meta
const showNav = computed(() => routeConfig.value.showNav !== false);
const showBackButton = computed(
  () => routeConfig.value.showBackButton !== false,
);
const showThemeToggle = computed(
  () => routeConfig.value.showThemeToggle !== false,
);
const pageTitle = computed(() => routeConfig.value.pageTitle || "");

// Check if we're on the home page
const isHomePage = computed(() => route.path === "/");

// Go back function
const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
};

// Initialize theme on mount
onMounted(() => {
  // Initialize theme from localStorage or system preference
  initTheme();

  // Listen for system theme changes (only if user hasn't set a preference)
  const cleanup = listenForSystemThemeChanges();

  // Cleanup on component unmount
  onUnmounted(() => {
    cleanup();
  });
});
</script>
