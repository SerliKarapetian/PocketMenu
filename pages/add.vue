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

definePageMeta({
  layout: "default",
  layoutConfig: {
    pageTitle: "Add Menu",
    showBackButton: true,
  },
});

const { $toast } = useNuxtApp();
const menuStore = useMenuStore();
const router = useRouter();

const handleScanned = (url: string) => {
  const result = menuStore.addMenu(url);

  if (result) {
    if (result.isDuplicate) {
      $toast.info(
        `"${result.menu.name}" already exists - updated last visited`,
      );
    } else {
      $toast.success(`"${result.menu.name}" added successfully!`);
    }
    router.push("/");
  } else {
    $toast.error("Invalid URL. Please check the link and try again.");
  }
};

const addLinks = (urls: string[]) => {
  const { added, duplicates, failed } = menuStore.addMultipleMenus(urls);

  // different scenarios
  if (added.length > 0 && duplicates.length === 0 && failed === 0) {
    // All added successfully
    $toast.success(
      `Added ${added.length} menu${added.length > 1 ? "s" : ""} successfully!`,
    );
    router.push("/");
  } else if (added.length > 0 && duplicates.length > 0 && failed === 0) {
    // Some added, some duplicates
    $toast.warning(
      `Added ${added.length} menu${added.length > 1 ? "s" : ""}, ${duplicates.length} already existed`,
    );
    router.push("/");
  } else if (added.length === 0 && duplicates.length > 0 && failed === 0) {
    // All duplicates
    $toast.info(
      `All ${duplicates.length} menu${duplicates.length > 1 ? "s" : ""} already exist - updated last visited`,
    );
    router.push("/");
  } else if (added.length > 0 && duplicates.length === 0 && failed > 0) {
    // Some added, some failed
    $toast.warning(
      `Added ${added.length} menu${added.length > 1 ? "s" : ""}, ${failed} failed`,
    );
    router.push("/");
  } else if (added.length === 0 && duplicates.length === 0 && failed > 0) {
    // All failed
    $toast.error(
      `Failed to add ${failed} menu${failed > 1 ? "s" : ""}. Please check your links.`,
    );
  } else {
    // Mixed results
    let message = "";
    if (added.length > 0)
      message += `Added ${added.length} menu${added.length > 1 ? "s" : ""}`;
    if (duplicates.length > 0) {
      if (message) message += ", ";
      message += `${duplicates.length} already existed`;
    }
    if (failed > 0) {
      if (message) message += ", ";
      message += `${failed} failed`;
    }
    $toast.warning(message);
    router.push("/");
  }
};
</script>
