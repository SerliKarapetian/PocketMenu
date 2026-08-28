<template>
  <div class="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
    <h1 class="text-3xl sm:text-4xl font-bold mb-8">
      {{ $t("menu.add_menu") }}
    </h1>

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
          <span class="bg-white dark:bg-gray-900 px-6 text-sm text-gray-500">{{
            $t("add.or")
          }}</span>
        </div>
      </div>

      <!-- Link Input -->
      <LinkInput @add-links="addLinks" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMenuStore } from "~/stores/menu";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const localePath = useLocalePath();
const isRtl = computed(() => locale.value === "fa");

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
      $toast.info(t("toast.duplicate", { name: result.menu.name }));
    } else {
      $toast.success(t("toast.added", { name: result.menu.name }));
    }
    router.push(localePath("/"));
  } else {
    $toast.error(t("toast.invalid_url"));
  }
};

const addLinks = (urls: string[]) => {
  const { added, duplicates, failed } = menuStore.addMultipleMenus(urls);

  // All added successfully
  if (added.length > 0 && duplicates.length === 0 && failed === 0) {
    $toast.success(
      t(`toast.added_${added.length === 1 ? "one" : "other"}`, {
        count: added.length,
      }),
    );
    router.push(localePath("/"));
  }
  // Some added, some duplicates
  else if (added.length > 0 && duplicates.length > 0 && failed === 0) {
    $toast.warning(
      t(`toast.added_with_duplicates_${added.length === 1 ? "one" : "other"}`, {
        added: added.length,
        duplicates: duplicates.length,
      }),
    );
    router.push(localePath("/"));
  }
  // All duplicates
  else if (added.length === 0 && duplicates.length > 0 && failed === 0) {
    $toast.info(
      t(`toast.all_duplicates_${duplicates.length === 1 ? "one" : "other"}`, {
        count: duplicates.length,
      }),
    );
    router.push(localePath("/"));
  }
  // Some added, some failed
  else if (added.length > 0 && duplicates.length === 0 && failed > 0) {
    $toast.warning(
      t(`toast.added_with_failed_${added.length === 1 ? "one" : "other"}`, {
        added: added.length,
        failed: failed,
      }),
    );
    router.push(localePath("/"));
  }
  // All failed
  else if (added.length === 0 && duplicates.length === 0 && failed > 0) {
    $toast.error(
      t(`toast.all_failed_${failed === 1 ? "one" : "other"}`, {
        count: failed,
      }),
    );
  }
  // Mixed results
  else {
    let message = "";
    if (added.length > 0) {
      message += t(
        `toast.added_count_${added.length === 1 ? "one" : "other"}`,
        {
          count: added.length,
        },
      );
    }
    if (duplicates.length > 0) {
      if (message) message += ", ";
      message += t(
        `toast.duplicates_count_${duplicates.length === 1 ? "one" : "other"}`,
        {
          count: duplicates.length,
        },
      );
    }
    if (failed > 0) {
      if (message) message += ", ";
      message += t(`toast.failed_count_${failed === 1 ? "one" : "other"}`, {
        count: failed,
      });
    }
    $toast.warning(message);
    router.push(localePath("/"));
  }
};
</script>
