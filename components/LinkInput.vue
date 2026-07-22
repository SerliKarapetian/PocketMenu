<template>
  <div>
    <label class="block text-sm font-medium mb-3">Paste Menu Link(s)</label>
    <textarea
      v-model="links"
      rows="5"
      placeholder="Paste one or multiple links here (one per line)"
      class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-3xl p-5 focus:outline-none focus:border-black resize-y min-h-[140px] text-base"
    ></textarea>

    <button
      @click="handleAdd"
      :disabled="!links.trim()"
      class="mt-6 w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-3xl font-medium disabled:opacity-50 active:scale-95 transition text-base"
    >
      Add Link{{ links.includes("\n") ? "s" : "" }}
    </button>
  </div>
</template>

<script setup>
const links = ref("");
const emit = defineEmits(["add-links"]);

const handleAdd = () => {
  const urls = links.value
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url.length > 0);

  emit("add-links", urls);
  links.value = "";
};
</script>
