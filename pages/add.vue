<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8">Add New Menu</h1>

    <div class="space-y-10">
      <!-- QR Scanner -->
      <QRScanner @scanned="handleScanned" />

      <!-- Divider -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div
            class="w-full border-t border-gray-300 dark:border-gray-700"
          ></div>
        </div>
        <div class="relative flex justify-center">
          <span class="bg-white dark:bg-gray-900 px-4 text-sm text-gray-500"
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
  menuStore.addMenu(url);
  router.push("/");
};

const addLinks = (urls: string[]) => {
  urls.forEach((url) => menuStore.addMenu(url));
  router.push("/");
};
</script>
