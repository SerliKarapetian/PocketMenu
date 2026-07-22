<template>
  <div class="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
    <h1 class="text-3xl sm:text-4xl font-bold mb-8">Add New Menu</h1>

    <div class="space-y-10">
      <!-- QR Scanner -->
      <QRScanner @scanned="handleScanned" />

      <!-- Divider -->
      <div class="relative py-4">
        <div class="absolute inset-0 flex items-center">
          <div
            class="w-full border-t border-gray-300 dark:border-gray-700"
          ></div>
        </div>
        <div class="relative flex justify-center">
          <span class="bg-white dark:bg-gray-900 px-6 text-sm text-gray-500"
            >OR</span
          >
        </div>
      </div>

      <!-- Link Input -->
      <LinkInput @add-links="addLinks" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMenuStore } from "~/stores/menu";

const menuStore = useMenuStore();
const router = useRouter();

const handleScanned = (url: string) => {
  const result = menuStore.addMenu(url);
  if (result) {
    router.push("/");
  }
};

const addLinks = (urls: string[]) => {
  const added = menuStore.addMultipleMenus(urls);
  if (added.length > 0) {
    router.push("/");
  }
};
</script>
