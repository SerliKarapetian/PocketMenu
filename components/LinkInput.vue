<template>
  <div>
    <label class="block text-sm font-medium mb-3">{{
      $t("add.paste_links")
    }}</label>
    <textarea
      v-model="links"
      rows="5"
      :placeholder="$t('add.paste_placeholder')"
      class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-3xl p-5 focus:outline-none focus:border-black resize-y min-h-[140px] text-base"
      :class="{
        'text-right': isRtl,
        'text-left': !isRtl,
      }"
    ></textarea>

    <button
      @click="handleAdd"
      :disabled="!links.trim()"
      class="mt-6 w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-3xl font-medium disabled:opacity-50 active:scale-95 transition text-base"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const isRtl = computed(() => locale.value === "fa");

const links = ref("");
const emit = defineEmits(["add-links"]);

const linkCount = computed(() => {
  const urls = links.value
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url.length > 0);
  return urls.length;
});

const buttonText = computed(() => {
  const count = linkCount.value;
  if (count <= 1) {
    return t("add.add_link_single");
  }
  return t("add.add_link_plural");
});

const handleAdd = () => {
  const urls = links.value
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url.length > 0);

  emit("add-links", urls);
  links.value = "";
};
</script>
