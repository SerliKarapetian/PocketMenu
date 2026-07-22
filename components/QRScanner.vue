<template>
  <div>
    <label class="block text-sm font-medium mb-3">Scan QR Code</label>
    <button
      @click="startScanning"
      class="w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center hover:border-black dark:hover:border-white transition"
    >
      <span class="text-5xl mb-3">📷</span>
      <span class="font-medium">Tap to Scan QR Code</span>
    </button>
    <p class="text-center text-xs text-gray-500 mt-3">
      Camera will open when you tap
    </p>
  </div>
</template>

<script setup>
const emit = defineEmits(["scanned"]);

const startScanning = () => {
  // Placeholder - we'll implement real scanner later
  const fakeUrl = prompt("For testing: Paste a menu URL");
  if (fakeUrl) emit("scanned", fakeUrl);
};
</script>
