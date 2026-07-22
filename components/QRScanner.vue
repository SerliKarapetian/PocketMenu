<template>
  <div>
    <label class="block text-sm font-medium mb-3">Scan QR Code</label>
    <button
      @click="startScanning"
      class="w-full h-40 sm:h-44 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center hover:border-black dark:hover:border-white active:scale-95 transition group"
    >
      <span class="text-5xl mb-3 group-hover:scale-110 transition">📷</span>
      <span class="font-medium text-base sm:text-lg">Tap to Scan QR Code</span>
      <span class="text-xs text-gray-500 mt-1">Camera will open</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  scanned: [url: string];
}>();

const startScanning = () => {
  // Check if browser supports QR scanning
  if ("BarcodeDetector" in window) {
    //  actual QR scanning will be implemented here
    const fakeUrl = prompt("For testing: Paste a menu URL");
    if (fakeUrl) emit("scanned", fakeUrl);
  } else {
    // Fallback for browsers without QR support
    const fakeUrl = prompt("Enter the menu URL from the QR code:");
    if (fakeUrl) emit("scanned", fakeUrl);
  }
};
</script>
