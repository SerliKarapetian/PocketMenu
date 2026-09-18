<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
      aria-label="Switch language"
      :class="[
        isDark
          ? 'text-white hover:text-white'
          : 'text-gray-700 hover:text-black',
      ]"
    >
      <Icon name="mdi:translate" class="w-4 h-4" />
      <span class="text-sm font-medium hidden sm:inline">
        {{ currentLocaleLabel }}
      </span>
      <Icon
        name="mdi:chevron-down"
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute mt-2 w-30 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden z-50"
      :class="{
        'right-0': !isRtl,
        'left-0': isRtl,
      }"
      :dir="currentDirection"
    >
      <button
        v-for="locale in localesWithFlags"
        :key="locale.code"
        @click="switchLanguage(locale.code)"
        class="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-between text-sm"
        :class="{
          'bg-gray-50 dark:bg-gray-800 font-medium':
            currentLocale === locale.code,
          'text-right': isRtl,
          'text-left': !isRtl,
        }"
      >
        <span
          class="flex items-center gap-2"
          :class="{ 'flex-row-reverse': isRtl }"
        >
          <span class="text-base">{{ locale.flag }}</span>
          {{ locale.name }}
        </span>
        <span
          v-if="currentLocale === locale.code"
          class="text-black dark:text-white"
        >
          ✓
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { locale, locales } = useI18n();
const { isDark } = useTheme();
const router = useRouter();
const switchLocalePath = useSwitchLocalePath();
const isRtl = computed(() => locale.value === "fa");

const isOpen = ref(false);

const currentLocale = computed(() => locale.value);
const currentDirection = computed(() => {
  return currentLocale.value === "fa" ? "rtl" : "ltr";
});

const currentLocaleLabel = computed(() => {
  const found = (locales.value as any[]).find(
    (l) => l.code === currentLocale.value,
  );
  return found ? found.code.toUpperCase() : "EN";
});

const localesWithFlags = computed(() => {
  const flags: Record<string, string> = {
    en: "🇬🇧",
    fa: "🇮🇷",
  };
  return (locales.value as any[]).map((l) => ({
    ...l,
    flag: flags[l.code] || "🌐",
  }));
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const switchLanguage = (langCode: string) => {
  if (langCode !== currentLocale.value) {
    // Navigate to the same page but with different locale in URL
    const newPath = switchLocalePath(langCode);
    router.push(newPath);
  }
  isOpen.value = false;
};

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (isOpen.value && !target.closest(".relative")) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
