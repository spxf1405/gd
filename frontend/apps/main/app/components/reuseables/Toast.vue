<script setup lang="ts">
import {
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
} from 'radix-vue'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

export interface ToastProps {
  variant?: 'success' | 'warning' | 'error' | 'info'
  title?: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

const props = withDefaults(defineProps<ToastProps>(), {
  variant: 'info',
  duration: 5000,
})

const emit = defineEmits<{
  close: []
}>()

const variantConfig = computed(() => {
  const configs = {
    success: {
      icon: 'lucide:check-circle-2',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
      iconClass: 'text-emerald-600 dark:text-emerald-400',
      titleClass: 'text-emerald-900 dark:text-emerald-100',
      descClass: 'text-emerald-700 dark:text-emerald-300',
    },
    warning: {
      icon: 'lucide:alert-triangle',
      bgClass: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800',
      iconClass: 'text-amber-600 dark:text-amber-400',
      titleClass: 'text-amber-900 dark:text-amber-100',
      descClass: 'text-amber-700 dark:text-amber-300',
    },
    error: {
      icon: 'lucide:alert-circle',
      bgClass: 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800',
      iconClass: 'text-red-600 dark:text-red-400',
      titleClass: 'text-red-900 dark:text-red-100',
      descClass: 'text-red-700 dark:text-red-300',
    },
    info: {
      icon: 'lucide:info',
      bgClass: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800',
      iconClass: 'text-blue-600 dark:text-blue-400',
      titleClass: 'text-blue-900 dark:text-blue-100',
      descClass: 'text-blue-700 dark:text-blue-300',
    },
  }
  return configs[props.variant]
})
</script>

<template>
  <ToastRoot
    :duration="duration"
    :class="[
      'flex items-start gap-3 rounded-lg border p-4 shadow-lg',
      'animate-in slide-in-from-right-full',
      'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full',
      'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
      'data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform',
      'data-[swipe=end]:animate-out data-[swipe=end]:slide-out-to-right-full',
      variantConfig.bgClass,
    ]"
    @update:open="(open) => !open && emit('close')"
  >
    <!-- Icon -->
    <Icon
      :icon="variantConfig.icon"
      :class="['h-5 w-5 flex-shrink-0 mt-0.5', variantConfig.iconClass]"
    />

    <!-- Content -->
    <div class="flex-1 space-y-1">
      <ToastTitle
        v-if="title"
        :class="['text-sm font-semibold', variantConfig.titleClass]"
      >
        {{ title }}
      </ToastTitle>
      
      <ToastDescription
        v-if="description"
        :class="['text-sm', variantConfig.descClass]"
      >
        {{ description }}
      </ToastDescription>

      <!-- Action Button -->
      <ToastAction
        v-if="action"
        :alt-text="action.label"
        class="mt-2 inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-80"
        :class="variantConfig.iconClass"
        @click="action.onClick"
      >
        {{ action.label }}
      </ToastAction>
    </div>

    <!-- Close Button -->
    <ToastClose
      class="rounded-md p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
      aria-label="Close"
    >
      <Icon icon="lucide:x" class="h-4 w-4 opacity-50 hover:opacity-100" />
    </ToastClose>
  </ToastRoot>
</template>