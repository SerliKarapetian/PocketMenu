<template>
  <div>
    <label class="block text-sm font-medium mb-3">{{ $t("qr.scan") }}</label>

    <!-- Scanner Container -->
    <div
      v-if="isScanning"
      class="relative rounded-3xl overflow-hidden bg-black"
    >
      <video ref="videoRef" class="w-full h-64 sm:h-80 object-cover"></video>

      <!-- Overlay with scanning frame -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute inset-0 bg-black/40"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-48 h-48 border-2 border-white rounded-lg relative">
            <div
              class="absolute top-0 w-8 h-8 border-t-2 border-white"
              :class="{
                'left-0 border-l-2': !isRtl,
                'right-0 border-r-2': isRtl,
              }"
            ></div>
            <div
              class="absolute top-0 w-8 h-8 border-t-2 border-white"
              :class="{
                'right-0 border-r-2': !isRtl,
                'left-0 border-l-2': isRtl,
              }"
            ></div>
            <div
              class="absolute bottom-0 w-8 h-8 border-b-2 border-white"
              :class="{
                'left-0 border-l-2': !isRtl,
                'right-0 border-r-2': isRtl,
              }"
            ></div>
            <div
              class="absolute bottom-0 w-8 h-8 border-b-2 border-white"
              :class="{
                'right-0 border-r-2': !isRtl,
                'left-0 border-l-2': isRtl,
              }"
            ></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-full h-0.5 bg-blue-500 animate-scan"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Status text -->
      <div
        class="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm z-10"
      >
        <span v-if="isProcessing">{{ $t("qr.processing") }}</span>
        <span v-else>{{ $t("qr.position_qr") }}</span>
      </div>

      <!-- Cancel button -->
      <button
        @click="stopScanning"
        class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm font-medium transition z-10"
      >
        {{ $t("qr.cancel") }}
      </button>
    </div>

    <!-- Scanner Button -->
    <button
      v-else
      @click="startScanning"
      class="w-full h-40 sm:h-44 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center hover:border-black dark:hover:border-white active:scale-95 transition group"
    >
      <span class="text-5xl mb-3 group-hover:scale-110 transition">📷</span>
      <span class="font-medium text-base sm:text-lg">{{
        $t("qr.tap_to_scan")
      }}</span>
      <span class="text-xs text-gray-500 mt-1">{{
        $t("qr.camera_will_open")
      }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const isRtl = computed(() => locale.value === "fa");

const emit = defineEmits<{
  scanned: [url: string];
}>();

const isScanning = ref(false);
const isProcessing = ref(false);
const videoRef = ref<HTMLVideoElement | null>(null);
let stream: MediaStream | null = null;
let scanInterval: number | null = null;

// Check if browser supports getUserMedia
const hasCameraSupport = () => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

const startScanning = async () => {
  if (!hasCameraSupport()) {
    // Fallback for browsers without camera support
    const fakeUrl = prompt(t("qr.enter_url"));
    if (fakeUrl) emit("scanned", fakeUrl);
    return;
  }

  try {
    isScanning.value = true;
    isProcessing.value = false;

    // Get camera stream
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    });

    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      await videoRef.value.play();

      // Start scanning after video is playing
      startQRDetection();
    }
  } catch (error) {
    console.error("Failed to start camera:", error);
    isScanning.value = false;

    // Show user-friendly error message
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    if (
      errorMessage.includes("NotAllowedError") ||
      errorMessage.includes("Permission denied")
    ) {
      alert(t("qr.permission_denied"));
    } else if (
      errorMessage.includes("NotFoundError") ||
      errorMessage.includes("No camera found")
    ) {
      alert(t("qr.no_camera"));
    } else {
      alert(t("qr.camera_error", { error: errorMessage }));
    }

    // Fallback to manual input
    const fakeUrl = prompt(t("qr.enter_url"));
    if (fakeUrl) emit("scanned", fakeUrl);
  }
};

const startQRDetection = () => {
  if (!videoRef.value) return;

  // Use canvas for QR detection
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  // Set canvas size to match video
  canvas.width = 640;
  canvas.height = 480;

  // Scan every 500ms
  scanInterval = window.setInterval(async () => {
    if (!videoRef.value || isProcessing.value || !isScanning.value) return;

    try {
      // Draw current video frame to canvas
      ctx.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Try to decode QR code
      const result = await decodeQRCode(imageData);

      if (result) {
        isProcessing.value = true;

        if (isValidUrl(result)) {
          emit("scanned", result);
          stopScanning();
        }

        // Reset processing flag after a short delay
        setTimeout(() => {
          isProcessing.value = false;
        }, 2000);
      }
    } catch (error) {
      // Silently handle errors - they occur on every frame
    }
  }, 500);
};

// QR Code decoding using the built-in BarcodeDetector API (preferred)
const decodeQRCode = async (imageData: ImageData) => {
  try {
    // Use native BarcodeDetector API if available (Chrome, Edge, Safari)
    if ("BarcodeDetector" in window) {
      const detector = new (window as any).BarcodeDetector({
        formats: ["qr_code"],
      });

      // Create a temporary canvas to get the image
      const canvas = document.createElement("canvas");
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.putImageData(imageData, 0, 0);

      const detections = await detector.detect(canvas);

      if (detections.length > 0) {
        return detections[0].rawValue;
      }
      return null;
    }

    // Fallback to jsQR library (will load dynamically)
    return await decodeWithJsQR(imageData);
  } catch (error) {
    console.warn("QR decoding error:", error);
    return null;
  }
};

// Fallback QR decoder using jsQR
const decodeWithJsQR = async (imageData: ImageData) => {
  try {
    // Dynamically import jsQR
    const jsQR = (await import("jsqr")).default;

    const result = jsQR(imageData.data, imageData.width, imageData.height);

    return result ? result.data : null;
  } catch (error) {
    console.warn("jsQR decoding error:", error);
    return null;
  }
};

const stopScanning = () => {
  isScanning.value = false;
  isProcessing.value = false;

  // Clear interval
  if (scanInterval) {
    clearInterval(scanInterval);
    scanInterval = null;
  }

  // Stop all video tracks
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }

  if (videoRef.value) {
    videoRef.value.srcObject = null;
  }
};

const isValidUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
};

// Clean up on component unmount
onUnmounted(() => {
  stopScanning();
});

// Handle page visibility change to stop scanner when tab is hidden
onMounted(() => {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && isScanning.value) {
      stopScanning();
    }
  });
});
</script>

<style scoped>
@keyframes scan {
  0% {
    transform: translateY(-50%);
  }
  100% {
    transform: translateY(50%);
  }
}

.animate-scan {
  animation: scan 2s ease-in-out infinite;
}
</style>
