<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
    @click.self="close"
  >
    <div class="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-md w-full shadow-2xl mx-4 max-h-[90vh] overflow-y-auto">
      <h3 class="text-xl font-bold mb-4">Edit Menu</h3>
      
      <!-- Menu Name -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Menu Name
        </label>
        <input
          v-model="form.name"
          type="text"
          class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
          placeholder="Enter menu name"
          @keyup.enter="save"
        />
      </div>

      <!-- Menu URL -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Menu URL
        </label>
        <input
          v-model="form.url"
          type="url"
          class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
          placeholder="https://example.com/menu"
        />
      </div>

      <!-- Menu Image -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Menu Image
        </label>
        
        <!-- Image Preview -->
        <div v-if="form.image" class="relative mb-3">
          <img
            :src="form.image"
            alt="Menu preview"
            class="w-full h-32 object-cover rounded-2xl"
          />
          <button
            @click="form.image = ''"
            class="absolute flex top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition"
          >
            <Icon name="mdi:close" class="w-4 h-4" />
          </button>
        </div>

        <!-- Image URL Input -->
        <div class="flex gap-2">
          <input
            v-model="form.image"
            type="url"
            class="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            placeholder="Paste image URL"
          />
          <button
            v-if="form.image"
            @click="previewImage"
            class="flex justify-center items-center px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <Icon name="mdi:eye" class="w-5 h-5" />
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          Paste a direct image URL
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 mt-6">
        <button
          @click="close"
          class="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-2xl font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        >
          Cancel
        </button>
        <button
          @click="save"
          class="flex-1 bg-black dark:bg-white text-white dark:text-black py-3 rounded-2xl font-medium hover:scale-105 active:scale-95 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Menu } from "~/types/menu";

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
  image: props.menu.image || '',
});

// Reset form when menu changes or modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    form.name = props.menu.name;
    form.url = props.menu.url;
    form.image = props.menu.image || '';
  }
}, { immediate: true });

const close = () => {
  emit('close');
};

const save = () => {
  if (!form.name.trim()) {
    alert('Please enter a menu name');
    return;
  }
  
  if (!form.url.trim()) {
    alert('Please enter a menu URL');
    return;
  }
  
  const updatedMenu: Menu = {
    ...props.menu,
    name: form.name.trim(),
    url: form.url.trim(),
    image: form.image || undefined,
  };
  
  emit('save', updatedMenu);
};

// Preview image in a new tab
const previewImage = () => {
  if (form.image) {
    window.open(form.image, '_blank');
  }
};

// Handle escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    close();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
});
</script>