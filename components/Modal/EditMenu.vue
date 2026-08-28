<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
    @click.self="close"
  >
    <div
      class="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-md w-full shadow-2xl mx-4 max-h-[90vh] overflow-y-auto"
    >
      <h3 class="text-xl font-bold mb-4">{{ $t("modal.edit_title") }}</h3>

      <!-- Menu Name -->
      <div class="mb-4">
        <label
          class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
          :class="{ 'text-right': isRtl }"
        >
          {{ $t("modal.menu_name") }}
        </label>
        <input
          v-model="form.name"
          type="text"
          class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
          :class="{
            'text-right': isRtl,
            'text-left': !isRtl,
          }"
          :placeholder="$t('modal.enter_menu_name')"
          @keyup.enter="save"
        />
      </div>

      <!-- Menu URL -->
      <div class="mb-4">
        <label
          class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
          :class="{ 'text-right': isRtl }"
        >
          {{ $t("modal.menu_url") }}
        </label>
        <input
          v-model="form.url"
          type="url"
          class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
          :class="{
            'text-right': isRtl,
            'text-left': !isRtl,
          }"
          :placeholder="$t('modal.enter_menu_url')"
        />
      </div>

      <!-- Menu Image -->
      <div class="mb-4">
        <label
          class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
          :class="{ 'text-right': isRtl }"
        >
          {{ $t("modal.menu_image") }}
        </label>

        <!-- Image Preview -->
        <div v-if="form.image" class="relative mb-3">
          <img
            :src="form.image"
            :alt="$t('modal.menu_preview')"
            class="w-full h-32 object-cover rounded-2xl"
          />
          <button
            @click="form.image = ''"
            class="absolute flex top-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition"
            :class="{
              'left-2': isRtl,
              'right-2': !isRtl,
            }"
          >
            <Icon name="mdi:close" class="w-4 h-4" />
          </button>
        </div>

        <!-- Image URL Input -->
        <div class="flex gap-2" :class="{ 'flex-row-reverse': isRtl }">
          <input
            v-model="form.image"
            type="url"
            class="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            :class="{
              'text-right': isRtl,
              'text-left': !isRtl,
            }"
            :placeholder="$t('modal.paste_image_url')"
          />
          <button
            v-if="form.image"
            @click="previewImage"
            class="flex justify-center items-center px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <Icon name="mdi:eye" class="w-5 h-5" />
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-1" :class="{ 'text-right': isRtl }">
          {{ $t("modal.paste_image_hint") }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 mt-6" :class="{ 'flex-row-reverse': isRtl }">
        <button
          @click="close"
          class="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-2xl font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        >
          {{ $t("modal.cancel") }}
        </button>
        <button
          @click="save"
          class="flex-1 bg-black dark:bg-white text-white dark:text-black py-3 rounded-2xl font-medium hover:scale-105 active:scale-95 transition"
        >
          {{ $t("modal.save_changes") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Menu } from "~/types/menu";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const { $toast } = useNuxtApp();
const isRtl = computed(() => locale.value === "fa");

interface Props {
  isOpen: boolean;
  menu: Menu;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  save: [menu: Menu];
}>();

const form = reactive({
  name: props.menu.name,
  url: props.menu.url,
  image: props.menu.image || "",
});

// Reset form when menu changes or modal opens
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      form.name = props.menu.name;
      form.url = props.menu.url;
      form.image = props.menu.image || "";
    }
  },
  { immediate: true },
);

const close = () => {
  emit("close");
};

const save = () => {
  if (!form.name.trim()) {
    $toast.error(t("modal.error_name_required"));
    return;
  }

  if (!form.url.trim()) {
    $toast.error(t("modal.error_url_required"));
    return;
  }

  const updatedMenu: Menu = {
    ...props.menu,
    name: form.name.trim(),
    url: form.url.trim(),
    image: form.image || undefined,
  };

  emit("save", updatedMenu);
};

// Preview image in a new tab
const previewImage = () => {
  if (form.image) {
    window.open(form.image, "_blank");
  }
};

// Handle escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.isOpen) {
    close();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
});
</script>
