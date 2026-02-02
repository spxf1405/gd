<script setup lang="ts">
import { ref } from "vue";
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "radix-vue";
import { Icon } from "@iconify/vue";

const emit = defineEmits<{
  (e: "submit", tournamentName: string): void;
}>();

const open = ref(false);
const tournamentName = ref("");
const showError = ref(false);

const handleSubmit = async () => {
  if (!tournamentName.value.trim()) {
    showError.value = true;
    return;
  }

  emit("submit", tournamentName.value);
  closeDialog();
};

const closeDialog = () => {
  open.value = false;
  tournamentName.value = "";
  showError.value = false;
};

const handleInput = () => {
  if (showError.value && tournamentName.value.trim()) {
    showError.value = false;
  }
};
</script>

<template>
  <DialogRoot v-model:open="open">
    <!-- Trigger Button -->
    <DialogTrigger
      class="bg-gradient-to-r from-[#00FFB3] to-[#00D4FF] hover:from-[#00FFB3]/80 hover:to-[#00D4FF]/80 px-6 py-3 rounded-lg font-bold text-black transition-all duration-200 shadow-lg hover:shadow-[#00FFB3]/20 inline-flex items-center w-fit h-12"
    >
      <Icon icon="lucide:plus" class="w-5 h-5 mr-2" />
      Tạo giải đấu nhanh
    </DialogTrigger>

    <DialogPortal>
      <DialogOverlay
        className="fixed inset-0 z-50 
             data-[state=open]:animate-in 
             data-[state=closed]:animate-out 
             data-[state=closed]:fade-out-0 
             data-[state=open]:fade-in-0 
             bg-black/75"
      />

      <DialogContent
        class="fixed left-[50%] top-[50%] z-50 w-full max-w-xl translate-x-[-50%] translate-y-[-50%] bg-gradient-to-br from-[#0A1628] to-[#0D1624] border border-[#00D4FF]/30 rounded-2xl shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 overflow-hidden"
      >
        <!-- Header -->
        <div class="px-6 py-5 border-b border-[#00D4FF]/20">
          <DialogTitle class="text-2xl font-bold text-white mb-2">
            Tạo giải đấu nhanh
          </DialogTitle>
          <DialogDescription class="text-sm text-gray-400">
            Tạo giải đấu mới chỉ trong vài giây
          </DialogDescription>
        </div>

        <!-- Content -->
        <div class="px-6 py-6">
          <!-- Info Hint -->
          <div
            class="bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded-lg p-4 mb-6"
          >
            <div class="flex items-start space-x-3">
              <Icon
                icon="lucide:info"
                class="w-4 h-4 text-[#00D4FF] mt-0.5 flex-shrink-0"
              />
              <div class="text-xs text-gray-300 leading-relaxed">
                <span class="font-semibold text-white">Lưu ý:</span> Bạn có thể
                chỉnh sửa mọi thông tin chi tiết của giải đấu sau trong phần
                <span class="text-[#00D4FF] font-medium">Cài đặt</span>.
              </div>
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Tên giải đấu <span class="text-red-400">*</span>
              </label>
              <input
                v-model="tournamentName"
                @input="handleInput"
                type="text"
                placeholder="Nhập tên giải đấu của bạn"
                class="w-full bg-[#0A1628] border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all duration-200"
                :class="
                  showError
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-[#00D4FF]/20 focus:border-[#00D4FF]/40'
                "
              />
              <transition
                enter-active-class="transition-all duration-200"
                enter-from-class="opacity-0 transform -translate-y-1"
                enter-to-class="opacity-100 transform translate-y-0"
                leave-active-class="transition-all duration-150"
                leave-from-class="opacity-100 transform translate-y-0"
                leave-to-class="opacity-0 transform -translate-y-1"
              >
                <p
                  v-if="showError"
                  class="text-red-400 text-xs mt-2 flex items-center"
                >
                  <Icon icon="lucide:alert-circle" class="w-3.5 h-3.5 mr-1.5" />
                  Vui lòng nhập tên giải đấu
                </p>
              </transition>
            </div>

            <!-- Footer Actions -->
            <div class="flex gap-3 pt-2">
              <DialogClose
                class="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-white"
              >
                Hủy
              </DialogClose>

              <button
                type="submit"
                class="flex-1 bg-gradient-to-r from-[#00FFB3] to-[#00D4FF] hover:from-[#00FFB3]/80 hover:to-[#00D4FF]/80 px-4 py-3 rounded-lg text-sm font-bold text-black transition-all duration-200 shadow-lg hover:shadow-[#00FFB3]/20 flex items-center justify-center"
              >
                <Icon icon="lucide:plus" class="w-4 h-4 mr-2" />
                Tạo giải đấu
              </button>
            </div>
          </form>
        </div>

        <!-- Close Button -->
        <DialogClose
          class="absolute right-4 top-4 rounded-lg p-2 hover:bg-white/10 transition-colors"
        >
          <Icon icon="lucide:x" class="w-4 h-4 text-gray-400" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
/* Beautiful backdrop with gradient overlay */
.backdrop-overlay {
  background:
    radial-gradient(
      circle at 20% 50%,
      rgba(0, 212, 255, 0.15) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(0, 255, 179, 0.15) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 20%,
      rgba(138, 43, 226, 0.1) 0%,
      transparent 50%
    ),
    linear-gradient(
      135deg,
      rgba(6, 19, 34, 0.95) 0%,
      rgba(13, 22, 36, 0.95) 100%
    );
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Custom animations */
@keyframes animate-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes animate-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

.data-\[state\=open\]\:animate-in[data-state="open"] {
  animation: animate-in 0.2s ease-out;
}

.data-\[state\=closed\]\:animate-out[data-state="closed"] {
  animation: animate-out 0.15s ease-in;
}
</style>
