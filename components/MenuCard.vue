<template>
  <div
    class="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-xl transition group h-full flex flex-col cursor-pointer"
    @click="openMenu"
  >
    <!-- Image Area -->
    <div
      class="h-36 sm:h-44 md:h-48 bg-gray-100 dark:bg-gray-800 relative flex items-center justify-center overflow-hidden flex-shrink-0"
    >
      <img
        v-if="menu.image"
        :src="menu.image"
        :alt="menu.name"
        class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
      />
      <div
        v-else
        class="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl shadow-inner group-hover:scale-110 transition duration-300"
      >
        🍽️
      </div>

      <!-- Menu Button -->
      <div class="absolute top-2 right-2 z-10">
        <button
          @click.stop="toggleMenu"
          class="p-1.5 flex rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
          aria-label="Menu options"
          ref="buttonRef"
        >
          <Icon name="mdi:dots-vertical" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Content Section -->
    <div class="p-3.5 sm:p-5 flex-1 flex flex-col">
      <h3
        class="font-semibold text-base sm:text-lg md:text-xl mb-1 line-clamp-2 leading-tight group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors"
      >
        {{ menu.name }}
      </h3>

      <div class="text-xs text-gray-500 mt-auto space-y-0.5">
        <p>Added {{ formatDate(menu.addedAt) }}</p>
        <p v-if="menu.lastVisited" class="text-gray-400">
          Last visited {{ formatDate(menu.lastVisited) }}
        </p>
      </div>
    </div>

    <!-- Dropdown Menu -->
    <Teleport to="body">
      <div
        v-if="dropdownStore.isOpen(menu.id)"
        ref="dropdownRef"
        class="fixed z-[100] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden py-1 min-w-[200px]"
        :style="dropdownStyle"
        @click.stop
      >
        <NuxtLink
          :to="`/menu/${menu.id}`"
          class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          @click="close"
        >
          <Icon
            name="mdi:eye"
            class="w-5 h-5 text-gray-600 dark:text-gray-400"
          />
          <span>Open Menu</span>
        </NuxtLink>

        <button
          @click="openEditModal"
          class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Icon
            name="mdi:pencil"
            class="w-5 h-5 text-gray-600 dark:text-gray-400"
          />
          <span>Edit Menu</span>
        </button>

        <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>

        <button
          @click="openDeleteModal"
          class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
        >
          <Icon name="mdi:delete" class="w-5 h-5" />
          <span>Delete Menu</span>
        </button>
      </div>
    </Teleport>

    <!-- Edit Modal -->
    <ModalEditMenu
      :is-open="showEditModal"
      :menu="menu"
      @close="closeEditModal"
      @save="saveEdit"
      @click.native.stop
    />

    <!-- Delete Modal -->
    <ModalDeleteConfirm
      :is-open="showDeleteModal"
      :menu-name="menu.name"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
      @click.native.stop
    />
  </div>
</template>

<script setup lang="ts">
import type { Menu } from "~/types/menu";
import { useMenuStore } from "~/stores/menu";
import { useDropdownStore } from "~/stores/dropdown";

const { $toast } = useNuxtApp();

const props = defineProps<{
  menu: Menu;
}>();

const emit = defineEmits<{
  delete: [id: string];
}>();

const menuStore = useMenuStore();
const dropdownStore = useDropdownStore();
const router = useRouter();

const showEditModal = ref(false);
const showDeleteModal = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLElement | null>(null);
const dropdownStyle = ref<Record<string, string>>({});

const isAnyModalOpen = computed(
  () => showEditModal.value || showDeleteModal.value,
);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Prevent open menu function when modal is open
const openMenu = (e: MouseEvent) => {
  if (isAnyModalOpen.value) {
    e.stopPropagation();
    return;
  }

  // Update last visited time
  menuStore.updateLastVisited(props.menu.id);
  // Navigate to the menu page
  router.push(`/menu/${props.menu.id}`);
};

const positionDropdown = () => {
  if (!buttonRef.value) return;

  const rect = buttonRef.value.getBoundingClientRect();
  const w = 200,
    h = 180,
    pad = 8;

  let top = rect.bottom + pad;
  let left = rect.right - w;

  if (top + h > window.innerHeight - pad) top = rect.top - h - pad;
  if (left < pad) left = pad;
  if (left + w > window.innerWidth - pad) left = window.innerWidth - w - pad;

  dropdownStyle.value = { top: `${top}px`, left: `${left}px` };
};

const toggleMenu = () => {
  dropdownStore.toggle(props.menu.id);
  if (dropdownStore.isOpen(props.menu.id)) {
    nextTick(positionDropdown);
  }
};

const close = () => {
  dropdownStore.close();
};

const openEditModal = () => {
  close();
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const saveEdit = (updatedMenu: Menu) => {
  const success = menuStore.updateMenu(updatedMenu);

  if (success) {
    $toast.success(`"${updatedMenu.name}" updated successfully!`);
  } else {
    $toast.error("Failed to update menu.");
  }
  closeEditModal();
};

const openDeleteModal = () => {
  close();
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const confirmDelete = () => {
  closeDeleteModal();
  emit("delete", props.menu.id);
  $toast.success(`"${props.menu.name}" deleted`);
};

// Close dropdown when clicking outside
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const isOpen = dropdownStore.isOpen(props.menu.id);

  if (
    isOpen &&
    dropdownRef.value &&
    !dropdownRef.value.contains(target) &&
    buttonRef.value &&
    !buttonRef.value.contains(target)
  ) {
    close();
  }
};

// Handle escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    if (dropdownStore.isOpen(props.menu.id)) close();
    if (showEditModal.value) closeEditModal();
    if (showDeleteModal.value) closeDeleteModal();
  }
};

// Handle reposition on scroll/resize
const handleReposition = () => {
  if (dropdownStore.isOpen(props.menu.id)) positionDropdown();
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleEscape);
  window.addEventListener("resize", handleReposition);
  window.addEventListener("scroll", handleReposition, true);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleEscape);
  window.removeEventListener("resize", handleReposition);
  window.removeEventListener("scroll", handleReposition, true);
});
</script>
