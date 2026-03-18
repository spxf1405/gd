<script setup lang="ts">
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "radix-vue";
import { Icon } from "@iconify/vue";

const emit = defineEmits<{
  (e: "confirm"): void;
}>();

const handleConfirm = () => {
  emit("confirm");
};
</script>

<template>
  <PopoverRoot>
    <!-- Trigger -->
    <PopoverTrigger
      class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-bold text-white transition-all duration-200 shadow-lg inline-flex items-center"
    >
      <Icon icon="lucide:trash-2" class="w-5 h-5 mr-2" />
      Xoá
    </PopoverTrigger>

    <!-- Popover Content -->
    <PopoverContent
      class="z-50 w-72 bg-gradient-to-br from-[#0A1628] to-[#0D1624] border border-red-500/30 rounded-xl shadow-xl p-5 data-[state=open]:animate-in data-[state=closed]:animate-out"
      align="center"
      :side-offset="10"
    >
      <div class="flex items-start space-x-3 mb-4">
        <Icon
          icon="lucide:alert-triangle"
          class="w-5 h-5 text-red-400 mt-0.5"
        />
        <div class="text-sm text-gray-300 leading-relaxed">
          Bạn có chắc chắn muốn
          <span class="text-red-400 font-semibold">xoá</span> mục này?
        </div>
      </div>

      <div class="flex gap-3">
        <PopoverClose
          class="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-white"
        >
          Huỷ
        </PopoverClose>

        <button
          @click="handleConfirm"
          class="flex-1 bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all duration-200 shadow-lg hover:shadow-red-500/20 flex items-center justify-center"
        >
          <Icon icon="lucide:trash-2" class="w-4 h-4 mr-2" />
          Xoá
        </button>
      </div>
      
    </PopoverContent>
  </PopoverRoot>
</template>

<style scoped>
.data- \[state\=open\] \:animate-in[data-state="open"] {
  animation: fadeIn 0.2s ease-out;
}
.data- \[state\=closed\] \:animate-out[data-state="closed"] {
  animation: fadeOut 0.15s ease-in;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes fadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
</style>
