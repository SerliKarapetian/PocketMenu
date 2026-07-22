<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
    @click.self="close"
  >
    <div
      class="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl mx-4"
    >
      <div class="text-center">
        <div class="text-5xl mb-4">🗑️</div>
        <h3 class="text-xl font-bold mb-2">Delete Menu</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Are you sure you want to delete "<span
            class="font-semibold text-gray-900 dark:text-white"
            >{{ menuName }}</span
          >"?<br />
          This action cannot be undone.
        </p>

        <div class="flex gap-3">
          <button
            @click="close"
            class="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-2xl font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-medium transition active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean;
  menuName: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const close = () => {
  emit("close");
};

const confirmDelete = () => {
  emit("confirm");
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
