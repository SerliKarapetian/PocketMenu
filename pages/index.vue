<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
    >
      <h1 class="text-3xl sm:text-4xl font-bold">{{ $t("menu.my_menus") }}</h1>

      <NuxtLink
        :to="localePath('/add')"
        class="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl font-medium flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition w-full sm:w-auto"
      >
        <span class="text-xl">+</span> {{ $t("menu.add_menu") }}
      </NuxtLink>
    </div>

    <!-- Search Bar with sort -->
    <div class="relative mb-6 sm:mb-8">
      <div class="relative">
        <input
          v-model="searchTerm"
          type="text"
          :placeholder="$t('menu.search_menus')"
          class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-3xl px-5 sm:px-6 py-4 pl-12 pr-14 sm:pl-14 sm:pr-16 focus:outline-none focus:border-black dark:focus:border-white transition text-base"
          :class="{
            'pl-14 pr-12 sm:pl-16 sm:pr-14': isRtl,
            'pl-12 pr-14 sm:pl-14 sm:pr-16': !isRtl,
          }"
          @input="handleSearch"
        />
        <span
          class="absolute top-1/2 -translate-y-1/2 text-gray-400 text-xl"
          :class="{
            'right-5 sm:right-6': isRtl,
            'left-5 sm:left-6': !isRtl,
          }"
        >
          🔍
        </span>

        <!-- Sort button -->
        <button
          @click="showSortOptions = !showSortOptions"
          class="absolute flex top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          :class="{
            'left-3': isRtl,
            'right-3': !isRtl,
          }"
          :aria-label="$t('sort.sort_by')"
        >
          <Icon name="mdi:sort" class="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <!-- Sort options dropdown -->
      <div
        v-if="showSortOptions"
        class="absolute mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden z-20"
        :class="{
          'left-0': isRtl,
          'right-0': !isRtl,
        }"
      >
        <button
          v-for="option in sortOptions"
          :key="option.value"
          @click="selectSort(option.value)"
          class="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-between text-sm"
          :class="{
            'bg-gray-50 dark:bg-gray-800 font-medium': sortBy === option.value,
          }"
        >
          <span class="flex items-center gap-2">
            <Icon :name="option.icon" class="w-4 h-4 text-gray-500" />
            {{ $t(option.translationKey) }}
          </span>
          <span
            v-if="sortBy === option.value"
            class="text-black dark:text-white"
            >✓</span
          >
        </button>
      </div>
    </div>

    <div v-if="menus.length === 0" class="text-center py-16 sm:py-20">
      <p class="text-2xl text-gray-400 mb-4">{{ $t("menu.no_menus") }}</p>
      <NuxtLink
        :to="localePath('/add')"
        class="text-blue-600 hover:underline text-lg"
      >
        {{ $t("menu.add_first") }}
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
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const localePath = useLocalePath();
const isRtl = computed(() => locale.value === "fa");

definePageMeta({
  layout: "default",
  layoutConfig: {
    showBackButton: false,
    pageTitle: "",
  },
});

const menuStore = useMenuStore();
const { $toast } = useNuxtApp();

const searchTerm = ref("");
const showSortOptions = ref(false);
const sortBy = ref<"newest" | "oldest" | "az" | "za" | "lastVisited">("newest");

const sortOptions = [
  {
    value: "newest" as const,
    translationKey: "sort.newest",
    icon: "mdi:clock-outline",
  },
  {
    value: "oldest" as const,
    translationKey: "sort.oldest",
    icon: "mdi:clock-in",
  },
  {
    value: "az" as const,
    translationKey: "sort.az",
    icon: "mdi:sort-alphabetical-ascending",
  },
  {
    value: "za" as const,
    translationKey: "sort.za",
    icon: "mdi:sort-alphabetical-descending",
  },
  {
    value: "lastVisited" as const,
    translationKey: "sort.last_visited",
    icon: "mdi:history",
  },
];

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

const selectSort = (value: typeof sortBy.value) => {
  sortBy.value = value;
  showSortOptions.value = false;
};

const deleteMenu = (id: string) => {
  menuStore.removeMenu(id);
};

// Close sort dropdown when clicking outside
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (showSortOptions.value && !target.closest(".relative")) {
    showSortOptions.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
