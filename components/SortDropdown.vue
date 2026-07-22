<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-3 hover:border-black dark:hover:border-white transition text-sm sm:text-base"
    >
      <span class="text-gray-500">Sort by:</span>
      <span class="font-medium">{{ currentSortLabel }}</span>
      <svg
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden z-20"
    >
      <button
        v-for="option in sortOptions"
        :key="option.value"
        @click="selectSort(option.value)"
        class="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-between text-sm"
        :class="{
          'bg-gray-50 dark:bg-gray-800 font-medium':
            currentSort === option.value,
        }"
      >
        {{ option.label }}
        <span
          v-if="currentSort === option.value"
          class="text-black dark:text-white"
          >✓</span
        >
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

type SortOption = "newest" | "oldest" | "az" | "za" | "lastVisited";

const props = defineProps<{
  modelValue: SortOption;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: SortOption];
}>();

const isOpen = ref(false);

const sortOptions = [
  { value: "newest" as const, label: "Newest First" },
  { value: "oldest" as const, label: "Oldest First" },
  { value: "az" as const, label: "A → Z" },
  { value: "za" as const, label: "Z → A" },
  { value: "lastVisited" as const, label: "Last Visited" },
];

const currentSort = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const currentSortLabel = computed(() => {
  return (
    sortOptions.find((opt) => opt.value === currentSort.value)?.label ||
    "Newest"
  );
});

const selectSort = (value: SortOption) => {
  currentSort.value = value;
  isOpen.value = false;
};

// Close dropdown when clicking outside
const onClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".relative")) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", onClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", onClickOutside);
});
</script>
